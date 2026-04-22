export interface LearningNode {
  title: string;
  description: string;
  duration: string;
  courses: string[];
  projects: string[];
  skills: string[];
}

export interface LearningPath {
  role: string;
  description: string;
  nodes: LearningNode[];
}

const SYSTEM_PROMPT = `
You are an expert career counselor and curriculum designer. 
Generate a comprehensive learning path for the requested career/role.
Return ONLY a valid JSON object matching this exact structure, with no markdown formatting or extra text:
{
  "role": "Title of the role",
  "description": "A short summary of what this role entails",
  "nodes": [
    {
      "title": "Phase 1: Title (e.g., Fundamentals)",
      "description": "What to learn in this phase",
      "duration": "Estimated time (e.g., 4 weeks)",
      "courses": ["Course 1", "Course 2"],
      "projects": ["Project 1"],
      "skills": ["Skill 1", "Skill 2"]
    }
  ]
}
Return 4 to 6 phases in the nodes array. Ensure it is perfectly valid JSON.
`;

export async function generateLearningPath(goal: string, apiKey: string): Promise<LearningPath> {
  let modelName = "gemini-1.5-pro";
  let url = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [{
      parts: [
        { text: SYSTEM_PROMPT },
        { text: `User Goal: ${goal}` }
      ]
    }]
  };

  try {
    let response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    // Auto-discover and retry on 404
    if (response.status === 404) {
      const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
      if (modelsRes.ok) {
        const modelsData = await modelsRes.json();
        const validModels = modelsData.models
          ?.filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
          ?.map((m: any) => m.name.replace('models/', ''));
        
        if (validModels && validModels.length > 0) {
          // Prefer pro, otherwise fallback to whatever is first (e.g. gemini-pro)
          modelName = validModels.find((m: string) => m.includes('pro') && !m.includes('2.5')) || validModels[0];
          url = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`;
          
          response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
          });
        }
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = response.statusText;
      try {
        const errJson = JSON.parse(errorText);
        if (errJson.error && errJson.error.message) {
          errorMessage = errJson.error.message;
        }
      } catch (e) {}

      throw new Error(`API Error (${modelName}): ${errorMessage}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error("Received empty response from the AI.");
    }

    try {
      // Strip markdown code blocks if the model accidentally includes them
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanedText) as LearningPath;
    } catch (parseError) {
      console.error("Failed to parse JSON:", text);
      throw new Error("Failed to parse the roadmap data. Please try again.");
    }

  } catch (error: any) {
    console.error("Generate error:", error);
    throw new Error(error.message || "Failed to generate a valid roadmap.");
  }
}
