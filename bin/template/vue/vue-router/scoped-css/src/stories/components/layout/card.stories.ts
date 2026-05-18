import Card from "../../../components/layout/card/card.vue";

export default {
    title: "Components/Layout/Card",
    component: Card,
    args: {
        title: "Harry Potter",
        src: "https://images.dog.ceo/breeds/spaniel-irish/n02102973_3844.jpg",
        alt: "Sample image",
        boxHeight: 320,
        srcWidth: 240,
        srcHeight: 240
    }
};

export const Default = {};
