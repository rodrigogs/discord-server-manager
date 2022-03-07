import { isBot } from 'lib/validators/member-joined/index.mjs'
import MemberJoinedRule from 'lib/router/member-joined-rule.mjs'
import AgeVerificationService from 'bot/services/age-verification.mjs'

export default new MemberJoinedRule({
  name: 'Age Verification',
  description: 'Ask users to verify their age',
  validator: [isBot(false)],
  processor: async (ctx) => {
    await AgeVerificationService.verifyMemberAge(ctx)
  },
})
