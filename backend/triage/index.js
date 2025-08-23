import { OpenAI } from "openai";
import { v4 as uuidv4 } from "uuid";
import KnowledgeBase from "../models/knowledgeBase.js";
import Config from "../models/configModel.js";
import AuditLog from "../models/auditLog.js";
import Ticket from "../models/ticketModel.js";
import dotenv from "dotenv";
dotenv.config();


class LLMProvider {
  constructor() {

    this.open_ai_api_key = process.env.OPENAI_API_KEY;
    this.stubMode = process.env.STUB_MODE === "true"
    if (!this.stubMode) {
      this.openai = new OpenAI({
        apiKey: this.open_ai_api_key,
        baseURL: "https://openrouter.ai/api/v1",
      });
    }
  }

  async classify(text) {
    if (this.stubMode) {
      return this.stubClassify(text);
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model:"openai/gpt-oss-20b:free",
        messages: [
          {
            role: "system",
            content:
              'Classify this support ticket into one of: billing, tech, shipping, or other. Respond with JSON only: { "predictedCategory": "category", "confidence": number }',
          },
          {
            role: "user",
            content: text,
          },
        ],
        max_tokens: 50,
        temperature: 0.1,
      });

      const response = JSON.parse(completion.choices[0].message.content);
      return response;
    } catch (error) {
      console.error("AI classification error, falling back to stub:", error);
      return this.stubClassify(text);
    }
  }

  stubClassify(text) {
    const lowerText = text.toLowerCase();
    let predictedCategory = "other";
    let confidence = 0.5;
    let keywordMatches = 0;

    // Billing keywords
    const billingKeywords = [
      "refund",
      "invoice",
      "payment",
      "charge",
      "bill",
      "billing",
      "price",
      "cost",
    ];
    const billingMatches = billingKeywords.filter((word) =>
      lowerText.includes(word)
    ).length;

    // Tech keywords
    const techKeywords = [
      "error",
      "bug",
      "stack",
      "crash",
      "login",
      "password",
      "technical",
      "software",
      "app",
    ];
    const techMatches = techKeywords.filter((word) =>
      lowerText.includes(word)
    ).length;

    // Shipping keywords
    const shippingKeywords = [
      "delivery",
      "shipment",
      "shipping",
      "tracking",
      "package",
      "order",
      "arrive",
      "deliver",
    ];
    const shippingMatches = shippingKeywords.filter((word) =>
      lowerText.includes(word)
    ).length;

    // Determine category based on keyword matches
    if (billingMatches > techMatches && billingMatches > shippingMatches) {
      predictedCategory = "billing";
      keywordMatches = billingMatches;
    } else if (techMatches > billingMatches && techMatches > shippingMatches) {
      predictedCategory = "tech";
      keywordMatches = techMatches;
    } else if (
      shippingMatches > billingMatches &&
      shippingMatches > techMatches
    ) {
      predictedCategory = "shipping";
      keywordMatches = shippingMatches;
    }

    // Calculate confidence based on keyword matches
    if (keywordMatches > 0) {
      confidence = Math.min(0.3 + keywordMatches * 0.15, 0.95);
    }

    return { predictedCategory, confidence };
  }

  async draft(text, articles) {
    if (this.stubMode) {
      return this.stubDraft(text, articles);
    }

    try {
      const articlesContext = articles
        .map(
          (article, index) =>
            `[${index + 1}] ${article.title}: ${article.body.substring(
              0,
              150
            )}...`
        )
        .join("\n");

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a customer support agent. Draft a helpful response based on the following knowledge base articles. Include numbered references to the articles like [1], [2], etc. Respond with JSON only: { "draftReply": "response text", "citations": ["articleId1", "articleId2"] }`,
          },
          {
            role: "user",
            content: `Ticket: ${text}\n\nKnowledge Base Articles:\n${articlesContext}`,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const response = JSON.parse(completion.choices[0].message.content);
      return response;
    } catch (error) {
      console.error("AI drafting error, falling back to stub:", error);
      return this.stubDraft(text, articles);
    }
  }

  stubDraft(text, articles) {
    const category = this.stubClassify(text).predictedCategory;

    const templates = {
      billing:
        "Thank you for your billing inquiry. Based on our knowledge base, we can help you with this issue. Please see the following articles for more information:",
      tech: "Thank you for reporting this technical issue. Our knowledge base has several articles that might help resolve this problem:",
      shipping:
        "Thank you for your shipping inquiry. We've found some relevant information in our knowledge base:",
      other:
        "Thank you for contacting us. We've found some information that might be helpful:",
    };

    let draftReply = templates[category] + "\n\n";

    articles.forEach((article, index) => {
      draftReply += `[${index + 1}] ${article.title}\n`;
    });

    draftReply +=
      "\nPlease let us know if this information helps resolve your issue.";

    return {
      draftReply,
      citations: articles.map((article) => article._id.toString()),
    };
  }
}

class TicketTriageAgent {
  constructor() {
    this.llmProvider = new LLMProvider();
    this.config = null;
  }

  async initialize() {
    this.config = (await Config.findOne()) || new Config();
  }

  async runTriage(ticketId) {
    const traceId = uuidv4();
    console.log(
      `Triage process started for ticket ${ticketId}, traceId: ${traceId}, stubMode: ${this.llmProvider.stubMode}`
    );
    console.log(process.env.OPENAI_API_KEY,process.env.STUB_MODE)

    try {
      await this.initialize();

      // Fetch the ticket
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        throw new Error(`Ticket ${ticketId} not found`);
      }

      await this.logEvent(traceId, ticketId, "TICKET_CREATED");

      // Step 1: Plan
      const plan = this.createPlan();
      await this.logEvent(traceId, ticketId, "PLAN_CREATED", { plan });

      // Step 2: Classify
      const classification = await this.classifyTicket(ticket, traceId);
      await this.logEvent(
        traceId,
        ticketId,
        "TICKET_CLASSIFIED",
        classification
      );

      const kbArticles = await this.retrieveKnowledgeBase(
        ticket,
        classification,
        traceId
      );
      await this.logEvent(traceId, ticketId, "KB_RETRIEVED", {
        count: kbArticles.length,
        articles: kbArticles.map((a) => ({ id: a._id, title: a.title })),
      });

      // Step 4: Draft reply
      const draftResult = await this.draftReply(ticket, kbArticles, traceId);
      await this.logEvent(traceId, ticketId, "DRAFT_GENERATED", {
        citations: draftResult.citations,
      });

      // Step 5: Make decision
      const decision = await this.makeDecision(
        ticket,
        classification,
        draftResult,
        traceId
      );
      await this.logEvent(traceId, ticketId, "AGENT_DECIDED", decision);

      console.log(`Triage process completed for ticket ${ticketId}`);
      return { success: true, traceId, decision };
    } catch (error) {
      await this.logEvent(traceId, ticketId, "ERROR_OCCURRED", {
        error: error.message,
      });
      console.error("Error in triage process:", error);
      throw error;
    }
  }

  createPlan() {
    return [
      "CLASSIFY: Determine ticket category",
      "RETRIEVE_KB: Find relevant knowledge base articles",
      "DRAFT: Compose a response with citations",
      "DECISION: Decide whether to auto-close or escalate",
    ];
  }

  async classifyTicket(ticket, traceId) {
    const text = `${ticket.title} ${ticket.description}`;
    return await this.llmProvider.classify(text);
  }

  async retrieveKnowledgeBase(ticket, classification, traceId) {
    const searchText = `${ticket.title} ${ticket.description}`;


    const keywords = this.extractKeywords(searchText);

    const kbArticles = await KnowledgeBase.find({
      status: "published",
      $or: [
        { tags: { $in: keywords } },
        { title: { $regex: keywords.join("|"), $options: "i" } },
        { body: { $regex: keywords.join("|"), $options: "i" } },
      ],
    }).limit(3);

    if (kbArticles.length < 3) {
      const fallbackArticles = await KnowledgeBase.find({
        status: "published",
        $or: [
          { tags: classification.predictedCategory },
          {
            title: { $regex: classification.predictedCategory, $options: "i" },
          },
        ],
      }).limit(3 - kbArticles.length);

      kbArticles.push(...fallbackArticles);
    }

    return kbArticles;
  }

  extractKeywords(text) {
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 3);

    // Remove common stop words
    const stopWords = [
      "this",
      "that",
      "with",
      "have",
      "from",
      "they",
      "what",
      "when",
      "were",
      "your",
    ];
    const filteredWords = words.filter((word) => !stopWords.includes(word));

    return [...new Set(filteredWords)].slice(0, 10);
  }

  async draftReply(ticket, articles, traceId) {
    const text = `${ticket.title} ${ticket.description}`;
    return await this.llmProvider.draft(text, articles);
  }

  async makeDecision(ticket, classification, draftResult, traceId) {
    const shouldAutoClose =
      this.config.autoCloseEnabled &&
      classification.confidence >= this.config.confidenceThreshold;

    if (shouldAutoClose) {
      // Create agent reply
      const reply = {
        content: draftResult.draftReply,
        generatedBy: "AI Agent",
        confidence: classification.confidence,
        citations: draftResult.citations,
        createdAt: new Date(),
      };

      // In a real implementation, you would save this to your TicketReplies model
      // For now, we'll just update the ticket
      ticket.status = "resolved";
      ticket.updatedAt = new Date();
      await ticket.save();

      await this.logEvent(traceId, ticket._id, "AUTO_CLOSED", {
        confidence: classification.confidence,
        threshold: this.config.confidenceThreshold,
      });

      return { action: "AUTO_CLOSED", confidence: classification.confidence };
    } else {
      // Escalate to human
      ticket.status = "waiting_human";
      ticket.updatedAt = new Date();
      await ticket.save();

      await this.logEvent(traceId, ticket._id, "ASSIGNED_TO_HUMAN", {
        reason: `Confidence ${classification.confidence} below threshold ${this.config.confidenceThreshold}`,
      });

      return { action: "ESCALATED", confidence: classification.confidence };
    }
  }

  async logEvent(traceId, ticketId, action, details = null) {
    try {
      await AuditLog.create({
        traceId,
        ticketId,
        actor: "system",
        action,
        meta: details,
      });
    } catch (error) {
      console.error("Failed to log audit event:", error);
    }
  }
}



export const ticketAgent = new TicketTriageAgent();

export const runTriage = (id) => {
  console.log("Triage process started...", id);
  return ticketAgent.runTriage(id);
};
