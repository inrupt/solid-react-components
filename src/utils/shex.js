const findAnnotation = (key: String, annotations: Object) => {
    if (annotations) {
        return annotations.find(annotation => annotation.predicate.includes(key));
    }
    return null;
};


const shexFormLabel = (data: Object) => {
    if (data.annotations) {
        const annotation = findAnnotation('layoutlabel', data.annotations);

        return annotation.object.value;
    }
    const { predicate } = data;

    return predicate.includes("#") ? predicate.split("#")[1] : predicate.split("/").pop();
};

export {
    shexFormLabel,
    findAnnotation
};
