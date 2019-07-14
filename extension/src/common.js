/* @flow */

export type Url = string;
export type Tag = string;
export type Second = number;
export type Locator = {
    title: string,
    href: ?string,
};
export type VisitsMap = {[Url]: Visits};
export type Dt = Date;

export function unwrap<T>(x: ?T): T {
    if (!x) {
        throw "undefined or null!";
    }
    return x;
}


export function date_formatter() {
    const options = {
        day   : 'numeric',
        month : 'short',
        year  : 'numeric',
        hour  : 'numeric',
        minute: 'numeric',
    };
    return new Intl.DateTimeFormat('en-GB', options);
}

// UGH there are no decent custom time format functions in JS..
export function format_dt(dt: Date): string {
    const dts = date_formatter().format(dt);
    return dts.replace(',', '');
}

export function format_duration(seconds: Second): string {
    let s = seconds;
    if (s < 60) {
        return `${s} seconds`
    }
    // forget seconds otherwise and just use days/hours/minutes
    s = Math.floor(s / 60);
    let parts = [];
    const hours = Math.floor(s / 60);
    s %= 60;
    if (hours > 0) {
        parts.push(`${hours} hours`);
    }
    parts.push(`${s} minutes`);
    return parts.join(" ");
}

export class Visit {
    time: Dt;
    tags: Array<Tag>;
    context: ?string;
    locator: ?Locator;
    duration: ?Second;


    constructor(time: Dt, tags: Array<Tag>, context: ?string=null, locator: ?Locator=null, duration: ?Second=null) {
        this.time = time;
        this.tags = tags;
        this.context = context;
        this.locator = locator;
        this.duration = duration;
    }

    repr(): string {
        return format_dt(this.time)  + " " + this.tags.toString();
    }
}

type VisitsList = Array<Visit>;

export class Visits {
    visits: VisitsList;

    constructor(visits: VisitsList) {
        this.visits = visits;
    }

    contexts(): Array<?Locator> {
        const locs = [];
        for (const visit of this.visits) {
            if (visit.context === null) {
                continue;
            }
            locs.push(visit.locator);
        }
        return locs;
    }
}

export class Blacklisted {
    url: Url;
    reason: string;

    constructor(url: Url, reason: string) {
        this.url = url;
        this.reason = reason;
    }
}
