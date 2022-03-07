import Rule from './rule.mjs'
import { RULE_TYPES } from './_rule-types.mjs'

export default class MemberJoinedRule extends Rule {
  /**
   * Create a new rule
   * @param {Object} options The options for the rule
   * @param {String} options.name The name of the rule
   * @param {String} [options.description] The description of the rule
   * @param {Function|Function[]} [options.validator=null] The validator(s) that the rule uses
   * @param {Function} options.processor The processor that the rule uses
   */
  constructor (options) {
    super({ ...options, type: RULE_TYPES.memberJoined })
  }
}
