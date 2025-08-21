

import {useAuth} from '../context/authContext';
import { useState } from 'react';

import { ArrowRight, Bot, CheckCircle, RefreshCw, Send } from 'lucide-react';
import StatusBadge from '../componets/statusBadge';


// const TicketDetail = () => {
//   const { user } = useAuth();
//   const [ticket, setTicket] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [replyText, setReplyText] = useState('');
//   const [showAuditLog, setShowAuditLog] = useState(false);



//   const handleSendReply = async () => {
//     setLoading(true);
//     // Simulate API call
//     setTimeout(() => {
//       setTicket({ ...ticket, status: 'resolved' });
//       setReplyText('');
//       setLoading(false);
//     }, 1000);
//   };

//   const handleAcceptDraft = () => {
//     if (ticket.agentSuggestion) {
//       setReplyText(ticket.agentSuggestion.draftReply);
//     }
//   };

//   if (!ticket) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-900">Ticket not found</h1>
//           <button
//             onClick={onBack}
//             className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700"
//           >
//             ← Back to tickets
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="mb-6">
//         <button
//           onClick={onBack}
//           className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
//         >
//           <ArrowRight className="h-4 w-4 mr-2 transform rotate-180" />
//           Back to tickets
//         </button>
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">{ticket.title}</h1>
//             <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
//               <span>Ticket #{ticket.id}</span>
//               <span>{ticket.category}</span>
//               <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
//             </div>
//           </div>
//           <StatusBadge status={ticket.status} />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Main Content */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Ticket Description */}
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
//             <p className="text-gray-700 leading-relaxed">{ticket.description}</p>
//           </div>

//           {/* AI Suggestion */}
//           {ticket.agentSuggestion && user?.role !== 'user' && (
//             <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-semibold text-purple-900 flex items-center">
//                   <Bot className="h-5 w-5 mr-2" />
//                   AI Suggestion
//                 </h2>
//                 <div className="text-sm text-purple-700">
//                   Confidence: {Math.round(ticket.agentSuggestion.confidence * 100)}%
//                 </div>
//               </div>
//               <div className="bg-white rounded-lg p-4 mb-4">
//                 <p className="text-gray-700">{ticket.agentSuggestion.draftReply}</p>
//               </div>
//               {ticket.agentSuggestion.citations.length > 0 && (
//                 <div className="mb-4">
//                   <h3 className="text-sm font-medium text-purple-900 mb-2">Referenced Articles:</h3>
//                   <div className="space-y-2">
//                     {ticket.agentSuggestion.citations.map(articleId => {
//                       const article = mockKBArticles.find(a => a.id === articleId);
//                       return article ? (
//                         <div key={articleId} className="bg-white rounded p-3 border border-purple-200">
//                           <h4 className="font-medium text-gray-900">{article.title}</h4>
//                           <p className="text-sm text-gray-600 mt-1">{article.body.substring(0, 100)}...</p>
//                         </div>
//                       ) : null;
//                     })}
//                   </div>
//                 </div>
//               )}
//               <button
//                 onClick={handleAcceptDraft}
//                 className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
//               >
//                 <CheckCircle className="h-4 w-4 mr-2" />
//                 Use Draft
//               </button>
//             </div>
//           )}

//           {/* Reply Section */}
//           {user?.role !== 'user' && ticket.status !== 'closed' && (
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">Send Reply</h2>
//               <div className="space-y-4">
//                 <textarea
//                   value={replyText}
//                   onChange={(e) => setReplyText(e.target.value)}
//                   rows={4}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                   placeholder="Type your reply..."
//                 />
//                 <div className="flex justify-between">
//                   <button
//                     onClick={handleAcceptDraft}
//                     disabled={!ticket.agentSuggestion}
//                     className="inline-flex items-center px-4 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <Bot className="h-4 w-4 mr-2" />
//                     Use AI Draft
//                   </button>
//                   <button
//                     onClick={handleSendReply}
//                     disabled={!replyText.trim() || loading}
//                     className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {loading ? (
//                       <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                     ) : (
//                       <Send className="h-4 w-4 mr-2" />
//                     )}
//                     Send Reply
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Sidebar */}
//         <div className="space-y-6">
//           {/* Ticket Info */}
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">Ticket Information</h2>
//             <div className="space-y-3">
//               <div className="flex justify-between">
//                 <span className="text-sm text-gray-600">Status:</span>
//                 <StatusBadge status={ticket.status} />
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-sm text-gray-600">Category:</span>
//                 <span className="text-sm font-medium text-gray-900 capitalize">{ticket.category}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-sm text-gray-600">Created:</span>
//                 <span className="text-sm font-medium text-gray-900">
//                   {new Date(ticket.createdAt).toLocaleString()}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-sm text-gray-600">Created by:</span>
//                 <span className="text-sm font-medium text-gray-900">
//                   {mockUsers.find(u => u.id === ticket.createdBy)?.name}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Audit Log */}
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-semibold text-gray-900">Activity Timeline</h2>
//               <button
//                 onClick={() => setShowAuditLog(!showAuditLog)}
//                 className="text-sm text-blue-600 hover:text-blue-700"
//               >
//                 {showAuditLog ? 'Hide' : 'Show'} Details
//               </button>
//             </div>
            
//             {showAuditLog ? (
//               <div className="space-y-3">
//                 {auditLogs.map(log => (
//                   <div key={log.id} className="flex items-start space-x-3">
//                     <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
//                     <div className="flex-1">
//                       <p className="text-sm font-medium text-gray-900">{log.action.replace('_', ' ')}</p>
//                       <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</p>
//                       {log.meta && (
//                         <p className="text-xs text-gray-600 mt-1">
//                           {JSON.stringify(log.meta, null, 2)}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-sm text-gray-600">
//                 {auditLogs.length} activity entries
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

const TicketDetail=()=>{
  return(
    <h1>Ticket Details</h1>
  )
}

export default TicketDetail;