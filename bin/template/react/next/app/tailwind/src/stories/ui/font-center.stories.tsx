import { FontCenter } from "@/components/ui";

const meta = {
    title: "components/ui/font-center",
    component: FontCenter
};

export default meta;

export const Default = {
    args: {
        children: <div className="p-6">Centered text</div>
    }
};

export const Callout = {
    args: {
        className: "rounded-xl bg-slate-100 p-8",
        children: <div>Centered callout block</div>
    }
};
