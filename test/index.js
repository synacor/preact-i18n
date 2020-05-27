import { h, render } from 'preact';
import wrap, { intl, IntlContext, IntlProvider, Text, MarkupText, Localizer, withText } from 'preact-i18n';
/* eslint-disable react/no-danger */

function Empty() {}

describe('intl', () => {
	let scope = 'test-scope',
		dictionary = { foo: 'bar', baz: 'bat' },
		options = { scope, definition: dictionary };

	before( () => rndr() );

	let root = document.createElement('div');

	function rndr(jsx) {
		render(<Empty />, root);
		if (jsx) render(jsx, root);
		return root;
	}

	it('should export things', () => {
		expect(intl).to.be.a('function');
		expect(wrap).to.be.a('function');
		expect(IntlProvider).to.be.a('function');
		expect(Text).to.be.a('function');
	});

	it('should work as a decorator @intl when given one argument', () => {
		let TestClass = sinon.spy();
		TestClass.contextType = IntlContext;

		let IntlTestClass = intl(options)(TestClass);
		rndr(<IntlTestClass />);
		expect(TestClass).to.have.been.calledWith({}, { intl: { dictionary, scope } });
	});

	it('should work as a function when given two arguments', () => {
		let TestClass = sinon.spy();
		TestClass.contextType = IntlContext;

		let IntlTestClass = intl(TestClass, options);
		rndr(<IntlTestClass />);
		expect(TestClass).to.have.been.calledWith({}, { intl: { dictionary, scope } });
	});

	describe('getWrappedComponent()', () => {

		it('should be a function', () => {
			let Wrapped = intl(options)(sinon.spy());
			expect(Wrapped.getWrappedComponent).to.be.a('function');
		});

		it('should return the Child component that it is wrapping', () => {
			let Foo = sinon.spy();
			let Wrapped = intl(options)(Foo);
			expect(Wrapped.getWrappedComponent()).to.equal(Foo);
		});

		it('should recursively call getWrappedComponent() on Child components to return the first non-decorator Child', () => {
			let Foo = sinon.spy();
			//Wrap Foo in two layers of configuration to make sure Foo is returned by the top level call to getWrappedComponent
			let Wrapped = intl(options)(intl(options)(Foo));
			expect(Wrapped.getWrappedComponent()).to.equal(Foo);
		});

	});


	describe('<IntlProvider>', () => {
		it('should provide context', () => {
			let Spy = sinon.stub().returns(null);
			Spy.contextType = IntlContext;

			rndr(
				<IntlProvider definition={dictionary}>
					<Spy />
				</IntlProvider>
			);

			expect(Spy).to.have.been.calledOnce.and.calledWithMatch({}, { intl: { dictionary } });

			Spy.reset();

			rndr(
				<IntlProvider scope="foo" definition={{ foo: dictionary }}>
					<Spy />
				</IntlProvider>
			);

			expect(Spy).to.have.been.calledOnce.and.calledWithMatch({}, {
				intl: {
					scope: 'foo',
					dictionary: { foo: dictionary }
				}
			});
		});

		it('should merge nested definitions', () => {
			const nestedDictionary = { nested: 'nested' };

			let Spy = sinon.stub().returns(null);
			Spy.contextType = IntlContext;

			rndr(
				<IntlProvider definition={dictionary}>
					<IntlProvider definition={nestedDictionary}>
						<Spy />
					</IntlProvider>
				</IntlProvider>
			);

			expect(Spy).to.have.been.calledOnce.and.calledWithMatch({}, { intl: { dictionary: { ...dictionary, ...nestedDictionary } } });
		});

		describe('mark', () => {
			it('should be off by default', () => {
				const Child = sinon.spy( () => <div /> );
				Child.contextType = IntlContext;

				rndr(
					<IntlProvider>
						<Child />
					</IntlProvider>
				);

				expect(Child).to.have.been.calledWithMatch({ }, { intl: { } });
			});

			it('should be triggered by <IntlProvider mark>', () => {
				const Child = sinon.spy( () => <div /> );
				Child.contextType = IntlContext;

				rndr(
					<IntlProvider mark>
						<Child />
					</IntlProvider>
				);

				expect(Child).to.have.been.calledWithMatch({ }, { intl: { mark: true } });
			});

			it('should be triggered by URL flag', () => {
				let url = location.pathname;

				function test(urlSuffix) {
					history.replaceState(null, null, url+urlSuffix);
					const Child = sinon.spy( () => <div /> );
					Child.contextType = IntlContext;

					rndr(
						<IntlProvider>
							<Child />
						</IntlProvider>
					);
					expect(Child).to.have.been.calledWithMatch({ }, { intl: { mark: true } });
				}

				test('?intl=show');
				test('#intl=show');
				test('?foo&intl=show');
				test('?foo=bar=&intl=show&baz=bat');

				history.replaceState(null, null, url);
			});
		});
	});

	describe('<Text>', () => {
		it('should fall back if not wrapped in a Provider', () => {
			rndr(
				<Text>FOO</Text>
			);

			expect(root.innerHTML).to.equal('FOO');
		});

		it('should render text without scope', () => {
			rndr(
				<IntlProvider definition={{ foo: 'FOO!' }}>
					<div>
						<Text id="foo" />
					</div>
				</IntlProvider>
			);

			expect(root.innerHTML).to.equal('<div>FOO!</div>');
		});

		it('should render text with scope', () => {

			rndr(
				<IntlProvider scope="foo" definition={{ foo: { bar: 'BAR!' } }}>
					<div>
						<Text id="bar" />
					</div>
				</IntlProvider>
			);

			expect(root.innerHTML, '').to.equal('<div>BAR!</div>');
		});

		it('should render html markup as string data, not markup', () => {

			rndr(
				<IntlProvider definition={{ foo: '<b>FOO</b>' }} >
					<div>
						<Text id="foo" />
					</div>
				</IntlProvider>
			);

			expect(root.innerHTML, '').to.equal('<div>&lt;b&gt;FOO&lt;/b&gt;</div>');
		});


		it('should render default when requested id is not present', () => {
			rndr(
				<IntlProvider scope="foo" definition={{ foo: { bar: 'BAR!' } }}>
					<div>
						<Text id="asdf">DEFAULT</Text>
					</div>
				</IntlProvider>
			);

			expect(root.innerHTML, '').to.equal('<div>DEFAULT</div>');
		});

		describe('mark', () => {
			it('should render translations with a green wrapping <mark>', () => {
				rndr(
					<IntlProvider mark definition={{ bar: 'BAR!' }}>
						<Text id="bar" />
					</IntlProvider>
				);

				expect(root.innerHTML).to.equal('<mark title="bar" style="background: rgba(119, 231, 117, 0.5);">BAR!</mark>');
			});

			it('should render translations relying on a fallback with a yellow wrapping <mark>', () => {
				rndr(
					<IntlProvider mark definition={{ bar: 'BAR!' }}>
						<Text id="foo">Fooey</Text>
					</IntlProvider>
				);
				expect(root.innerHTML).to.equal('<mark title="foo" style="background: rgba(229, 226, 41, 0.5);">Fooey</mark>');
			});

			it('should render missing translations with an orange wrapping <mark>', () => {
				rndr(
					<IntlProvider mark definition={{ bar: 'BAR!' }}>
						<Text id="foo" />
					</IntlProvider>
				);
				expect(root.innerHTML).to.equal('<mark title="foo" style="background: rgba(228, 147, 51, 0.5);"></mark>');

			});
		});
	});

	describe('<MarkupText>', () => {

		it('should render nothing if no key or fallback is found', () => {
			rndr(
				<MarkupText />
			);

			expect(root.innerHTML).to.equal('');
		});


		it('should fall back if not wrapped in a Provider', () => {
			rndr(
				<MarkupText><b>FOO</b></MarkupText>
			);

			expect(root.innerHTML).to.equal('<span><b>FOO</b></span>');
		});

		it('should render multi-child fallback', () => {
			rndr(
				<MarkupText>This <b>is the fallback</b> with multiple children</MarkupText>
			);

			expect(root.innerHTML).to.equal('<span>This <b>is the fallback</b> with multiple children</span>');
		});

		it('should render text without scope', () => {
			rndr(
				<IntlProvider definition={{ foo: 'FOO!' }}>
					<div>
						<MarkupText id="foo" />
					</div>
				</IntlProvider>
			);

			expect(root.innerHTML).to.equal('<div><span>FOO!</span></div>');
		});

		it('should render text with scope', () => {
			rndr(
				<IntlProvider scope="foo" definition={{ foo: { bar: 'BAR!' } }}>
					<div>
						<MarkupText id="bar" />
					</div>
				</IntlProvider>
			);

			expect(root.innerHTML, '').to.equal('<div><span>BAR!</span></div>');
		});


		it('should render default when requested id is not present', () => {
			rndr(
				<IntlProvider scope="foo" definition={{ foo: { bar: 'BAR!' } }}>
					<div>
						<MarkupText id="asdf"><b>DEFAULT</b></MarkupText>
					</div>
				</IntlProvider>
			);

			expect(root.innerHTML, '').to.equal('<div><span><b>DEFAULT</b></span></div>');
		});

		it('should render html markup as markup', () => {
			rndr(
				<IntlProvider definition={{ foo: '<b>FOO</b>' }} >
					<div>
						<MarkupText id="foo" />
					</div>
				</IntlProvider>
			);

			expect(root.innerHTML, '').to.equal('<div><span><b>FOO</b></span></div>');
		});

		describe('mark', () => {
			it('should render translations with a green wrapping <mark>', () => {
				rndr(
					<IntlProvider mark definition={{ bar: '<b>BAR!</b>' }}>
						<MarkupText id="bar" />
					</IntlProvider>
				);

				expect(root.innerHTML).to.equal('<mark title="bar" style="background: rgba(119, 231, 117, 0.5);"><span><b>BAR!</b></span></mark>');
			});

			it('should render translations relying on a fallback with a yellow wrapping <mark>', () => {
				rndr(
					<IntlProvider mark definition={{ bar: '<b>BAR!</b>' }}>
						<MarkupText id="foo"><b>Fooey</b></MarkupText>
					</IntlProvider>
				);
				expect(root.innerHTML).to.equal('<mark title="foo" style="background: rgba(229, 226, 41, 0.5);"><span><b>Fooey</b></span></mark>');
			});

			it('should render missing translations with an orange wrapping <mark>', () => {
				rndr(
					<IntlProvider mark definition={{ bar: '<b>BAR!</b>' }}>
						<MarkupText id="foo" />
					</IntlProvider>
				);
				expect(root.innerHTML).to.equal('<mark title="foo" style="background: rgba(228, 147, 51, 0.5);"></mark>');

			});
		});


	});

	describe('withText()', () => {
		it('should provide strings to child as props', () => {
			const Child = sinon.stub().returns(<div />);
			const Wrapped = withText({
				propName: 'foo'
			})(Child);

			rndr(
				<IntlProvider definition={{ foo: 'FOO!' }}>
					<Wrapped />
				</IntlProvider>
			);

			expect(Child).to.have.been.calledOnce.and.calledWithMatch({ propName: 'FOO!' });
		});

		it('should accept a CSV of keys', () => {
			const Child = sinon.stub().returns(<div />);
			const Wrapped = withText('foo,bar,baz')(Child);

			rndr(
				<IntlProvider definition={{ foo: '1', bar: '2', baz: '3' }}>
					<Wrapped />
				</IntlProvider>
			);

			expect(Child).to.have.been.calledOnce.and.calledWithMatch({ foo: '1', bar: '2', baz: '3' });
		});

		it('should accept an Array of keys', () => {
			const Child = sinon.stub().returns(<div />);
			const Wrapped = withText(['foo','bar','baz'])(Child);

			rndr(
				<IntlProvider definition={{ foo: '1', bar: '2', baz: '3' }}>
					<Wrapped />
				</IntlProvider>
			);

			expect(Child).to.have.been.calledOnce.and.calledWithMatch({ foo: '1', bar: '2', baz: '3' });
		});

		it('should support <Text> as a value', () => {
			const Child = sinon.stub().returns(<div />);
			const Wrapped = withText({
				normal: <Text id="foo" />,
				missing: <Text id="bar" />,
				withchild: <Text id="baz">child</Text>,
				withfallback: <Text id="bat" fallback="fallback" />
			})(Child);

			rndr(
				<IntlProvider definition={{ foo: 'FOO!' }}>
					<Wrapped />
				</IntlProvider>
			);

			expect(Child).to.have.been.calledOnce.and.calledWithMatch({
				normal: 'FOO!',
				missing: null,
				withchild: 'child',
				withfallback: 'fallback'
			});
		});

		describe('getWrappedComponent()', () => {

			it('should be a function', () => {
				const Wrapped = withText(['foo','bar','baz'])(sinon.spy());
				expect(Wrapped.getWrappedComponent).to.be.a('function');
			});

			it('should return the Child component that it is wrapping', () => {
				let Foo = sinon.spy();
				let Wrapped = withText(['foo','bar','baz'])(Foo);
				expect(Wrapped.getWrappedComponent()).to.equal(Foo);
			});

			it('should recursively call getWrappedComponent() on Child components to return the first non-decorator Child', () => {
				let Foo = sinon.spy();
				//Wrap Foo in two layers of configuration to make sure Foo is returned by the top level call to getWrappedComponent
				let Wrapped = withText(['foo','bar','baz'])(withText(['buzz'])(Foo));
				expect(Wrapped.getWrappedComponent()).to.equal(Foo);
			});

		});

	});

	describe('<Localizer>', () => {
		it('should translate any <Text> props on its child', () => {
			rndr(
				<IntlProvider definition={{ input: { pl: 'type a name' } }}>
					<Localizer>
						<input
							placeholder={<Text id="input.pl" />}
							title={<Text id="input.title">blah</Text>}
							type="email"
							minlength={0}
							maxlength={1}
							required
						/>
					</Localizer>
				</IntlProvider>
			);

			expect(root).to.have.property('innerHTML', `<input placeholder="type a name" title="blah" type="email" minlength="0" maxlength="1" required="">`);
		});

	});
});
