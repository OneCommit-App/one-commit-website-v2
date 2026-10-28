import assert from 'node:assert/strict'
import test from 'node:test'
import { summarize } from './budgets.mjs'
function fixture(lcp=2499, cls=0.099, bytes=250*1024) {
 return { categories:{ performance:{score:0.9}}, audits:{ 'largest-contentful-paint':{numericValue:lcp},'cumulative-layout-shift':{numericValue:cls},'resource-summary':{details:{items:[{resourceType:'script',transferSize:bytes}]}}}}
}
test('strict LCP/CLS boundaries and inclusive JS ceiling use transfer bytes',()=>{
 assert.deepEqual(summarize(fixture(), '/', 'mobile').failures, [])
 assert.deepEqual(summarize(fixture(2500,0.1,250*1024+1), '/', 'mobile').failures,['LCP','CLS','JS'])
 assert.deepEqual(summarize(fixture(4000), '/', 'desktop').failures,[])
})
test('missing measurement or runtime failure cannot be a passing budget',()=>{
 assert.throws(()=>summarize({runtimeError:{message:'page failed'}},'/','mobile'),/page failed/)
 const missing=fixture(); delete missing.audits['cumulative-layout-shift'];
 assert.throws(()=>summarize(missing,'/','mobile'),/missing cumulative/)
})

test('invalid performance scores cannot be coerced into successful summaries', () => {
 for (const score of [null, undefined, NaN, Infinity, -0.01, 1.01, '0.9']) {
  const report=fixture(); report.categories.performance.score=score
  assert.throws(()=>summarize(report,'/','mobile'),/invalid performance score/)
 }
 const missing=fixture(); delete missing.categories
 assert.throws(()=>summarize(missing,'/','mobile'),/invalid performance score/)
 for (const score of [0,1]) {
  const report=fixture(); report.categories.performance.score=score
  assert.equal(summarize(report,'/','mobile').score,score*100)
 }
})

test('individual audit errors fail even when budget metrics are available', () => {
 for (const audit of [{scoreDisplayMode:'error'}, {errorMessage:'broken artifact'}, {scoreDisplayMode:'error',errorMessage:'broken artifact'}]) {
  const report=fixture(); report.audits['speed-index']=audit
  assert.throws(()=>summarize(report,'/','mobile'),/audit speed-index failed/)
 }
 const report=fixture(); report.audits['unused-javascript']={scoreDisplayMode:'notApplicable',score:null}
 assert.deepEqual(summarize(report,'/','mobile').failures,[])
})
