export type SectionType = "watch" | "review"

export class Time {
    mode: SectionType
    start: number
    end: number
    subtitleStart: number | null
    subtitleEnd: number | null
    japanese: string | null

    constructor(mode: SectionType, start: number, end: number, subtitleStart: number | null, subtitleEnd: number | null, japanese: string | null) {
        this.mode = mode
        this.start = start
        this.end = end
        this.subtitleStart = subtitleStart
        this.subtitleEnd = subtitleEnd
        this.japanese = japanese
    }
}

export class Timestamps {
    timestamps: Array<Time>

    constructor(times: Array<[number, number | null, number | null, string | null]>) {
        this.timestamps = []
        let mode: SectionType = "watch"

        for (let section = 0; section < times.length; section++) {
            let endTime = section + 1 < times.length ? times[section + 1][0] : 9999
            this.timestamps.push(new Time(mode, times[section][0], endTime, times[section][1], times[section][2], times[section][3]))
            mode = mode == "watch" ? "review" : "watch"
        }
    }

    time(section: number) {
        return this.timestamps[section]
    }

    times() {
        return this.timestamps
    }

    timesForMode(mode: SectionType) {
        return this.timestamps.filter((time) => time.mode === mode)
    }

    timeFor(time: number | [number, string]) {
        return Array.isArray(time) ? time[0] : time
    }

    textFor(time: number | [number, string]): string | null {
        return Array.isArray(time) ? time[1] : null
    }
}
