namespace SmtpServerForE2ETest {

    export interface AppConfig extends ng.resource.IResource<AppConfig> {

        smtpEndPoints: EndPoint[];

        apiEndPoint: EndPoint;

        enableSMTPAuth: boolean;

        accounts: Account[];
    }
}