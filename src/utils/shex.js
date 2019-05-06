const findAnnotation = (key: String, annotations: Object) => {
  if (annotations) {
    return annotations.find(annotation => annotation.predicate.includes(key));
  }
  return null;
};

const shexFormLabel = (data: Object) => {
  if (data.annotations) {
    const annotation = findAnnotation("label", data.annotations);
    if (annotation) {
      return annotation.object.value;
    }
  }
  const { predicate } = data;

  if (predicate) {
    return predicate.includes("#")
        ? predicate.split("#")[1]
        : predicate.split("/").pop();
  }
};

const shexParentLinkOnDropDowns = (parent: Object, expression: Object) => {
  return (parent &&
    parent.predicate &&
    parent.expression &&
    parent.expression.expressions.legnth > 0) ||
    (expression &&
      expression.expression &&
      expression.expression.expressions.length > 0)
    ? parent.predicate
    : null;
};

const allowNewFields = (data: Object) => {
  const totalData = data._formValues.length;

  return (
    (!data.min && !data.max) ||
    (data.min > 0 && data.max > totalData) ||
    data.max === -1
  );
};

const canDelete = (data) => data.min === undefined || data.min === 1 ? data._formValues.length > 1 : true;

export {
  shexFormLabel,
  findAnnotation,
  shexParentLinkOnDropDowns,
  allowNewFields,
  canDelete
};
