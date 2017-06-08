import template from '../../src/lib/template';

describe('template()', () => {
	it('should leave fieldless unmodified', () => {
		expect(template('foo')).to.equal('foo');
		expect(template('{foo}')).to.equal('{foo}');
		expect(template('{{foo\\}}')).to.equal('{{foo\\}}');
		expect(template('a{{$$}}')).to.equal('a{{$$}}');
	});

	it('should inject top-level fields', () => {
		const FIELDS = {
			foo: 'FOO',
			bar: 'baz'
		};

		expect(template('{{foo}}', FIELDS)).to.equal('FOO');
		expect(template('{{foo}}{{bar}}', FIELDS)).to.equal('FOObaz');
		expect(template('a {{foo}} b {{bar}} c', FIELDS)).to.equal('a FOO b baz c');
	});

	it('should inject nested fields', () => {
		const FIELDS = {
			foo: {
				bar: {
					baz: 'bat'
				}
			},
			arr: [
				'a',
				{ b: 1 }
			]
		};

		expect(template('{{foo.bar.baz}}', FIELDS)).to.equal('bat');
		expect(template('{{foo.bar}}', FIELDS)).to.equal('[object Object]');
		expect(template('{{arr.0}}', FIELDS)).to.equal('a');
		expect(template('{{arr.1.b}}', FIELDS)).to.equal('1');
	});

	it('should support recursive field injection', () => {
		const FIELDS = {
			first: '1{{second}}2',
			second: '3{{third}}4',
			third: 'THIRD'
		};

		expect(template('{{first}}', FIELDS)).to.equal('13THIRD42');
	});

	it('should replace empty fields with the empty string', () => {
		const FIELDS = {
			baz: 'baz'
		};

		expect(template('{{foo}}', FIELDS)).to.equal('');
		expect(template('{{foo.bar}}', FIELDS)).to.equal('');
		expect(template('Fooey {{foo.bar}}', FIELDS)).to.equal('Fooey ');
		expect(template('Fooey {{foo.bar}} {{baz}}', FIELDS)).to.equal('Fooey  baz');
	});

	it('should replace fields with falsey values', () => {
		const FIELDS = {
			foo: 0,
			bar: false
		};

		expect(template('{{foo}}', FIELDS)).to.equal('0');
		expect(template('{{bar}}', FIELDS)).to.equal('false');
	});

});
