import { setup } from "@storybook/vue3-vite";
import { defineComponent, h } from "vue";

setup((app) => {
    app.component(
        "NuxtImg",
        defineComponent({
            name: "NuxtImg",
            props: {
                src: { type: String, required: false, default: "" },
                alt: { type: String, required: false, default: "" },
                width: {
                    type: [String, Number],
                    required: false,
                    default: undefined
                },
                height: {
                    type: [String, Number],
                    required: false,
                    default: undefined
                }
            },
            setup(props, { attrs }) {
                return () => h("img", { ...attrs, ...props });
            }
        })
    );
});

const preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i
            }
        }
    }
};

export default preview;
