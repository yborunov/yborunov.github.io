
describe('Contacts list app testing', function() {

    var count_contacts_before = -1;

    beforeEach(function() {

        browser().navigateTo('./');
    });

    it('count contacts in list', function () {
 
        element('.list-group').query(function($el, done) {

            count_contacts_before = $el.find('.list-group-item').length;
            done();
        });
    });

    it("adding new contact test", function() {

        element('.navbar button').click();

        input('modalInfo.name').enter('Anna');
        input('modalInfo.surname').enter('Karenina');
        input('modalInfo.phone').enter('+74953230923');
        input('modalInfo.group').enter('friends');

        element('#contactModal button[type="submit"]', 'Submit add contact form').click();

        expect(element('.list-group .list-group-item').count()).toBe( count_contacts_before + 1 );
    });  

    it("edit contact test", function() {

        element('.list-group .list-group-item:last-child').click();

        input('modalInfo.name').enter('Miley');
        input('modalInfo.surname').enter('Cyrus');
        input('modalInfo.phone').enter('+18471930234');
        input('modalInfo.group').enter('singers');

        element('#contactModal button[type="submit"]', 'Submit add contact form').click();

/*        element('.list-group .list-group-item:last-child').click();

        expect(input('modalInfo.name').val()).toBe( 'Miley' );
        expect(input('modalInfo.surname').val()).toBe( 'Cyrus' );
        expect(input('modalInfo.phone').val()).toBe( '+18471930234' );
        expect(input('modalInfo.group').val()).toBe( 'singers' );

        element('#contactModal button[type="button"]', 'Close edit contact form').click();*/
    }); 
});