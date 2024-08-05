import { intro, note, outro, text } from "@clack/prompts";
import { $, spawn } from "bun";
import pc from "picocolors";

intro(pc.bgCyan(`next-scaffold`));

const projectName = await text({
	message: "What is your project name?",
	placeholder: "project-name",
	validate(value) {
		if (value.length === 0) return `Please enter a project name.`;
	},
});

await $`bun create next-app@latest ${projectName} --ts --tailwind --eslint --app --src-dir --use-bun --import-alias '@/*'`;
await $`bunx --bun shadcn-ui@latest init -c ${projectName} -y -d`;
note(`
${pc.green("cd " + projectName.toString())} to get into your next js app
${pc.green("bun dev")} to start the development server`);
outro(`You're all set!`);
