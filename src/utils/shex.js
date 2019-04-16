const findAnnotation = (key: String, expression: Object) => {
    return expression.annotations.find(annotation => annotation.predicate.includes(key));
};


const shexFormLabel = (data: Object) => {
    if (data.annotations) {
        const annotation = findAnnotation('layoutlabel', data);

        return annotation.object.value;
    }
    const { predicate } = data;

    return predicate.includes("#") ? predicate.split("#")[1] : predicate.split("/").pop();
};

export {
    shexFormLabel,
    findAnnotation
};
