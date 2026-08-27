import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateDocument, documentItems } from '../server/routes/operations';
import { readAal } from '../server/supabase';

function token(payload: Record<string, unknown>) {
  return `x.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.x`;
}

test('document totals calculate integer cents and GST on each line', () => {
  const items = documentItems.parse([
    { description: 'Callout', quantity: 1, unit_price_cents: 10000, gst_rate: 0.1 },
    { description: 'Parts', quantity: 2.5, unit_price_cents: 1234, gst_rate: 0 },
  ]);
  assert.deepEqual(calculateDocument(items), { subtotal: 13085, gst: 1000 });
});

test('document item validation rejects negative prices and unsupported tax rates', () => {
  assert.equal(documentItems.safeParse([{ description: 'Bad', quantity: 1, unit_price_cents: -1, gst_rate: 0.1 }]).success, false);
  assert.equal(documentItems.safeParse([{ description: 'Bad', quantity: 1, unit_price_cents: 1, gst_rate: 0.2 }]).success, false);
});

test('AAL is read only from the signed-token payload shape', () => {
  assert.equal(readAal(token({ aal: 'aal1' })), 'aal1');
  assert.equal(readAal(token({ aal: 'aal2' })), 'aal2');
  assert.equal(readAal(token({ aal: 'admin' })), null);
  assert.equal(readAal('invalid'), null);
});
