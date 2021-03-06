import moment from 'moment'
import getPlan from './plan.js'
import { sur } from './model.js'

const totalDays = (uds, ud) => {
    return uds.length * ud
    },
    currentDay = (uds, day) => {
        const timeIndex = moment().add(day + 1, 'days').format('e')
        return uds[timeIndex]
    },
    currentWeek = (uds, day) => {
        return Math.floor(moment.duration(day + 1, 'days').asWeeks()) + 1
    },
    date = (day) => {
        return moment().add(day, 'day').format('L')
    },
    start = (uds, day, plan) => {
        const isCurrenDayHavePlan = currentDay(uds, day)
        if (isCurrenDayHavePlan.selected) {
            return { ayat: plan[0].start.ayat, name: plan[0].start.name }
        } else {
            return false
        }
    },
    end = (uds, day, plan) => {
        const isCurrenDayHavePlan = currentDay(uds, day)
        if (isCurrenDayHavePlan.selected) {
            const obj = { ayat: plan[0].end.ayat, name: plan[0].end.name }
            plan.shift()
            return obj
        } else {
            return false
        }
    },
    userSelections = (prop) => {
        return prop.filter(ele => ele.selected)
            .map(ele => ele.time)
    },
    peroidshandler = (ups, uds, day, plan) => {
        return ups.map(peroid => {
            return {name: peroid, start: start(uds, day, plan), end: end(uds, day, plan) }
        })
    },
    fullPlan = (uds, ups, ud) => {
        const plan = [],
            days = totalDays(uds, ud),
            udsl = userSelections(uds),
            upsl = userSelections(ups);
        let setPlan = getPlan(ud, udsl.length, upsl.length, sur)
        for (let i = 0; i < days; i++) {
            plan.push({
                day: currentDay(uds, i),
                week: currentWeek(uds, i),
                peroids: peroidshandler(upsl, uds, i, setPlan),
                done: false,
                date: date(i),
            })
        }
        return plan
    }

export default fullPlan