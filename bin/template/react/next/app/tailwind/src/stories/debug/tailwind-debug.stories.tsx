import type { Meta, StoryObj } from "@storybook/nextjs";

const meta = {
    title: "debug/tailwind",
    parameters: { layout: "centered" }
} satisfies Meta<Record<string, unknown>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    render: () => (
        <div>
            <div className="bg-blue-400 text-white p-6">
                Tailwind blue 400 (bg-blue-400)
            </div>
            <div className="bg-slate-100 text-slate-900 p-6 mt-4">
                Tailwind slate 100 (bg-slate-100)
            </div>
            <div className="bg-[aqua] text-black p-6 mt-4">
                Arbitrary bg (bg-[aqua])
            </div>
        </div>
    )
};
