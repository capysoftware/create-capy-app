import { intro, outro, text } from "@clack/prompts";
import { $ } from "bun";

intro(`next-scaffold`);

const projectName = await text({
	message: "What is your project name?",
	placeholder: "project-name",
	validate(value) {
		if (value.length === 0) return `Please enter a project name.`;
	},
});

await $`bun create next-app@latest ${projectName} --ts --tailwind --eslint --app --src-dir --use-bun --import-alias '@/*'`;

outro(`You're all set!`);
