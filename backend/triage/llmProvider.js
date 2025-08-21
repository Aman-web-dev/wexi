




class LLMProvider {
  constructor() {
    this.stubMode = process.env.STUB_MODE === 'true';
  }
  
  async classify(text) {
    if (this.stubMode) {
      return this.stubClassify(text);
    }
  
    return this.callOpenAIForClassification(text);
  }
  
  async draftReply(text, articles) {
    if (this.stubMode) {
      return this.stubDraftReply(text, articles);
    }

    return this.callOpenAIForDrafting(text, articles);
  }
  
  stubClassify(text) {

    const lowerText = text.toLowerCase();
    let predictedCategory = 'other';
    let confidence = 0.3;
    
    if (/\b(refund|invoice|payment|charge|billing)\b/.test(lowerText)) {
      predictedCategory = 'billing';
      confidence = 0.8;
    } else if (/\b(error|bug|crash|stack|technical|login)\b/.test(lowerText)) {
      predictedCategory = 'tech';
      confidence = 0.7;
    } else if (/\b(ship|deliver|package|tracking|shipping)\b/.test(lowerText)) {
      predictedCategory = 'shipping';
      confidence = 0.75;
    }
    
    return { predictedCategory, confidence };
  }
  
  stubDraftReply(text, articles) {
    
    const citations = articles.map(article => article._id);
    let draftReply = `Thank you for contacting support about your issue. `;
    
    if (articles.length > 0) {
      draftReply += `Based on our knowledge base, here's some information that might help:\n\n`;
      articles.forEach((article, index) => {
        draftReply += `${index + 1}. ${article.title}\n`;
      });
      draftReply += `\nPlease let us know if this information helps resolve your issue.`;
    } else {
      draftReply += `We're looking into your issue and will get back to you shortly.`;
    }
    
    return { draftReply, citations };
  }
}