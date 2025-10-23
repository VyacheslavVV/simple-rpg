import { Entity } from './Entity.js';
import { AttributesComponent } from '../components/AttributesComponent.js';
import { PositionComponent } from '../components/PositionComponent.js';

export default class Player extends Entity {
  constructor(x, y, width, height) {
    super();
    
    // Добавляем компоненты
    this.addComponent('position', new PositionComponent(x, y, width, height));
    this.addComponent('attributes', new AttributesComponent({
      fatigue: 0,
      maxFatigue: 100,
      health: 100,
      stamina: 100
    }));
    
    this._icon = '🐻';
  }

  get icon() {
    return this._icon;
  }

  // Удобные методы-обёртки
  getFatigue() {
    return this.getComponent('attributes').getAttribute('fatigue');
  }

  addFatigue(amount) {
    const attrs = this.getComponent('attributes');
    const newFatigue = Math.min(
      attrs.getAttribute('fatigue') + amount,
      attrs.getAttribute('maxFatigue')
    );
    attrs.setAttribute('fatigue', newFatigue);
  }

  resetFatigue(amount = 10) {
    const attrs = this.getComponent('attributes');
    const newFatigue = Math.max(0, attrs.getAttribute('fatigue') - amount);
    attrs.setAttribute('fatigue', newFatigue);
  }

  canTakeChallenge(difficulty) {
    const fatigue = this.getFatigue();
    const maxFatigue = this.getComponent('attributes').getAttribute('maxFatigue');
    return (fatigue + difficulty) <= maxFatigue;
  }

  getPosition() {
    return this.getComponent('position');
  }
}
