import { addOurWorkItem } from "./actions/landing/ourWork";

async function test() {
	const result = await addOurWorkItem({
		title: "Test Item",
		slug: "test-item",
		content: "<p>This is a test</p>",
		image_url: "",
	});
	console.log(result);
}

test();
