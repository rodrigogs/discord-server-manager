import { isBot } from 'main/validators/member-joined/index.mjs'
import MemberJoinedRule from 'main/router/member-joined-rule.mjs'
import AgeVerificationService from 'main/services/age-verification.mjs'

export default new MemberJoinedRule({
  name: 'Age Verification',
  description: 'Ask users to verify their age',
  validator: [isBot(false)],
  processor: async (ctx) => {
    await AgeVerificationService.verifyMemberAge(ctx)
  },
})
