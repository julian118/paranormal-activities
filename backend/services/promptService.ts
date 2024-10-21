// deno-lint-ignore-file require-await
import { readJson, readJsonSync } from 'https://deno.land/x/jsonfile/mod.ts';



export default class PromptService {
    private randChoice<T>(arr: Array<T>): T {
        return arr[Math.floor(Math.random() * arr.length)]
      }

    async getRandomPrompt(): Promise<string> {
        const prompts = ["What is the meaning of ____ in the afterlife?",
                        "Why do the spirits fear ____?",
                        "How does ____ affect the living?",
                        "What secret about ____ do the spirits wish to reveal?",
                        "How can we protect ourselves from ____?",
                        "What message do the spirits have about ____?",
                        "Why do the spirits keep whispering about ____?",
                        "What will happen when ____ aligns with the stars?",
                        "How can we summon the strength of ____?",
                        "What dark force lies hidden within ____?",
                        "Why are the spirits drawn to ____ tonight?",
                        "What is the true purpose of ____?"
                    ]
        return this.randChoice<string>(prompts)
    }
    
}