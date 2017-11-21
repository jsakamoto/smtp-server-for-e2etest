namespace SmtpServerForE2ETest {

    export interface SimplifiedMail extends ng.resource.IResource<SimplifiedMail> {

        id: string;

        subject: string;

        selected: boolean;
    }
}