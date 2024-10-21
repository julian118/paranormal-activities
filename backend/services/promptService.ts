import { readJson, readJsonSync } from 'https://deno.land/x/jsonfile/mod.ts';



export default class PromptService {

    async getRandomPrompt(): Promise<string> {
        const prompt = await readJson('../data/testPrompts.json') as string[]
        return prompt[0]
    }
    
}