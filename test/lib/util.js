import { select } from '../../src/lib/util';

describe('util', () => {
	describe('select()', () => {
		it('should return objects unmodified', () => {
			let obj = { foo: 'foo', bar: 'bar' };
			expect(select(obj)).to.equal(obj);
		});

		it('should create an object mapping from an Array', () => {
			expect(select(['foo'])).to.eql({ foo: 'foo' });
			expect(select(['foo', 'bar'])).to.eql({ foo: 'foo', bar: 'bar' });
			expect(select(['foo.a', 'bar.b'])).to.eql({ a: 'foo.a', b: 'bar.b' });
		});

		it('should return create an object mapping from a CSV String', () => {
			expect(select('a')).to.eql({ a: 'a' });
			expect(select('foo,bar')).to.eql({ foo: 'foo', bar: 'bar' });
			expect(select('foo , bar')).to.eql({ foo: 'foo', bar: 'bar' });
		});
	});
});
