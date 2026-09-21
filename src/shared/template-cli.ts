export const templateCliConfig = {
    react: {
        title: "React",
        command: "npx",
        args: ["github:ShionTerunaga/react-template-cli#release"]
    },
    vue: {
        title: "Vue",
        command: "npx",
        args: ["github:ShionTerunaga/vue-template-cli#release"]
    }
} as const;

export type TechStack = keyof typeof templateCliConfig;

export const techStacks = Object.keys(templateCliConfig) as TechStack[];
