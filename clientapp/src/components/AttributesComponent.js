export class AttributesComponent {
  constructor(initialValues = {}) {
    this.attributes = {
      fatigue: initialValues.fatigue || 0,
      maxFatigue: initialValues.maxFatigue || 100,
      difficulty: initialValues.difficulty || 0,
      ...initialValues
    };
  }

  getAttribute(name) {
    return this.attributes[name];
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  modifyAttribute(name, delta) {
    if (this.attributes[name] !== undefined) {
      this.attributes[name] += delta;
    }
  }

  hasAttribute(name) {
    return this.attributes[name] !== undefined;
  }
}
