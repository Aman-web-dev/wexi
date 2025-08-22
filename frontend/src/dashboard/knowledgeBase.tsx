import React, { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, BookOpen, Save, X } from "lucide-react";
import { useAuth } from "../context/authContext.tsx";
import KBEditor from "../components/KbEditor.tsx";
import type { Article } from "../types.ts";

const KnowledgeBase = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filter, setFilter] = useState("all");
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article|null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const { user } = useAuth();

  const API_BASE_URL = "http://localhost:9000/api/v1/knowledgebase";


  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL + "/", {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setArticles(data.data || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setError("Failed to fetch articles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Save article (create or update)
  const saveArticle = async (articleData:Article) => {
    try {
      let response;
      if (articleData._id) {
        // Update existing article
        response = await fetch(`${API_BASE_URL}/${articleData._id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(articleData),
        });

        if(response.ok){
          fetchArticles();
        }
      } else {
        // Create new article
        response = await fetch(API_BASE_URL + "/", {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(articleData),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (articleData._id) {
        // Update the article in the local state
        setArticles(articles.map(a => a._id === articleData._id ? result.data : a));
      } else {
        // Add the new article to the local state
        setArticles([result.data, ...articles]);
      }
      
      setShowEditor(false);
      setEditingArticle(null);
    } catch (error) {
      console.error("Error saving article:", error);
      throw error; // Re-throw to handle in editor
    }
  };

  // Delete article
  const deleteArticle = async (articleId:string) => {
    if (!confirm("Are you sure you want to delete this article?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${articleId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove the article from local state
      setArticles(articles.filter(a => a._id !== articleId));
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Failed to delete article. Please try again.");
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchArticles();
    }
  }, [user]);

const filteredArticles = articles.filter((article) => {
  const lowerSearch = (searchTerm || "").toLowerCase();

  const matchesSearch =
    (article.title?.toLowerCase() || "").includes(lowerSearch) ||
    (article.body?.toLowerCase() || "").includes(lowerSearch) ||
    article.tags?.some((tag: string) =>
      (tag || "").toLowerCase().includes(lowerSearch)
    );

  const matchesFilter = filter === "all" || article.status === filter;

  return matchesSearch && matchesFilter;
});

  const handleEdit = (article:Article) => {
    setEditingArticle(article);
    setShowEditor(true);
  };

  const handleNew = () => {
    setEditingArticle(null);
    setShowEditor(true);
  };

  const handleCancel = () => {
    setShowEditor(false);
    setEditingArticle(null);
  };

  if (loading && articles?.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {showEditor ? (
        <KBEditor
          article={editingArticle || null}
          onSave={saveArticle}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Knowledge Base
              </h1>
              <p className="text-gray-600 mt-2">
                Manage support articles and documentation ({articles?.length} articles)
              </p>
            </div>
            <button
              onClick={handleNew}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Article
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
              <button
                onClick={fetchArticles}
                className="ml-2 text-red-800 underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search articles, tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="all">All Articles</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Articles Grid */}
          {filteredArticles?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <div
                  key={article._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {article.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${
                        article.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {article.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.body}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {article.tags?.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{article.tags?.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                    <span>
                      Updated: {new Date(article.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleEdit(article)}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteArticle(article._id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filter !== "all" ? "No articles found" : "No articles yet"}
              </h3>
              <p className="text-gray-600">
                {searchTerm || filter !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by creating your first article."
                }
              </p>
              {(!searchTerm && filter === "all") && (
                <button
                  onClick={handleNew}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Article
                </button>
              )}
            </div>
          )}

          {loading && articles?.length > 0 && (
            <div className="text-center py-4">
              <div className="inline-flex items-center text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Refreshing...
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default KnowledgeBase;