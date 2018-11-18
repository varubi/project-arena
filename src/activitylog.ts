export class ActivityLog {
    private log: Array<any> = [];
    public add(activity: any) {
        this.log.push(activity);
    }
}