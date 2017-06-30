import { Angular2FullStackPage } from './app.po';

describe('angular2-full-stack App', () => {
  let page: Angular2FullStackPage;

  beforeEach(() => {
    page = new Angular2FullStackPage();
  });

  it('should display the navbar correctly', () => {
    page.navigateTo();
    expect(page.getNavbarElement(0)).toEqual('Home');
    expect(page.getNavbarElement(1)).toEqual('Cats');
    expect(page.getNavbarElement(1)).toEqual('Games');
    expect(page.getNavbarElement(3)).toEqual('Login');
    expect(page.getNavbarElement(4)).toEqual('Register');
  });
});
