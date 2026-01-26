
import { GoogleGenAI } from "@google/genai";

export async function generateMatchInsight(opponent: string, isHome: boolean): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Schrijf een korte, enthousiaste voorbeschouwing van maximaal 2 zinnen in het Nederlands voor de wedstrijd van vv Twenthe tegen ${opponent}. Ze spelen ${isHome ? 'thuis' : 'uit'}. Noem de jubileumsfeer en de clubkleuren rood en blauw.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text ?? "De rood-blauwe formatie van vv Twenthe is er helemaal klaar voor!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "De rood-blauwe formatie van vv Twenthe is er helemaal klaar voor! Een historische wedstrijd in dit jubileumjaar.";
  }
}

export async function generateLeaderboardRoast(leaderName: string, lastPlaceName: string): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Schrijf een humoristische, luchtige samenvatting van maximaal 2 zinnen in het Nederlands over de huidige tussenstand van de vv Twenthe poule. ${leaderName} staat bovenaan en ${lastPlaceName} bungelt onderaan. Houd het sportief en grappig.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text ?? "De strijd bij vv Twenthe barst los!";
  } catch (error) {
    console.error("Gemini Roast Error:", error);
    return "De strijd bij vv Twenthe barst los! Sommigen tonen tactisch vernuft, terwijl anderen... nou ja, er is altijd volgend seizoen!";
  }
}
