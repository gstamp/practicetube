export type SectionType = "watch" | "review"

export class Time {
    mode: SectionType
    start: number
    end: number
    japanese: string | null

    constructor(mode: SectionType, start: number, end: number, japanese: string | null) {
        this.mode = mode
        this.start = start
        this.end = end
        this.japanese = japanese
    }
}

export class Timestamps {
    timestamps: Array<Time>

    constructor(times: Array<number | [number, string]>) {
        this.timestamps = []
        let mode: SectionType = "watch"

        for (let i = 0; i < times.length; i++) {
            let endTime = i + 1 < times.length ? this.timeFor(times[i + 1]) : 9999
            this.timestamps.push(new Time(mode, this.timeFor(times[i]), endTime, this.textFor(times[i])))
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
