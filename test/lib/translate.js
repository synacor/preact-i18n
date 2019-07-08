import { h } from 'preact';
import translate from '../../src/lib/translate';
import { Text } from '../../src/components/text';

describe('translate', () => {

	it('should return the value from the dictionary if a dot-notated match on id is found', () => {
		expect(translate('foo.bar', undefined, { foo: { bar: 'hello' } })).to.equal('hello');
	});

	it('should prefix scope to id to resolve dot-notated id in dictionary', () => {
		expect(translate('foo.bar', 'myScope', { myScope: { foo: { bar: 'hello' } } })).to.equal('hello');
		expect(translate('foo.bar', 'myScope', { foo: { bar: 'hello' } })).to.be.null;
	});

	it('should return null if no id match is found in the dictionary and not fallback is provided', () => {
		expect(translate('foo.bar', undefined, {})).to.be.null;
	});

	it('should return the fallback when a value from the dictionary by a dot-notated id match is not found', () => {
		expect(translate('foo.bar', undefined, {}, undefined, undefined, 'testFallback')).to.equal('testFallback');
	});

	it('should replace dot-notated templated strings when given a fields attribute', () => {
		expect(translate('foo.bar', undefined, { foo: { bar: 'hello{{c.d}}' } }, { c: { d: 'World' } })).to.equal('helloWorld');
	});

	it('should translate <Text /> components that exist in field values when working on templated strings', () => {
		expect(translate('foo.bar', undefined, { foo: { bar: 'hello{{c.d}}' }, e: 'World' }, { c: { d: <Text id="e" /> } })).to.equal('helloWorld');
	});


});
