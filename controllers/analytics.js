const Order = require('./../models/Order');
const errorHadler = require('../utils/errorHandler');
const moment = require('moment');

module.exports.overview = async function (req, res) {
    try {
        const allOrders = await Order.find({ user: req.user.id }).sort(1);
        const ordersMap = getOrdersMap(allOrders);
        const yesterdayOrders =
            ordersMap[moment().add(-1, 'd').format('DD.MM.YYYY')] || [];

        // Количество заказов вчера
        const yestertdayOrdersNumber = yesterdayOrders.length;
        //Количество заказов
        const totalOrdersNumber = allOrders.length;
        // Количество дней всего
        const daysNumber = Object.keys(orderMap).length;
        //Заказов в день
        const ordersPerDay = (totalOrdersNumber / daysNumber).toFixed(0);
        // Процент для количество заказов
        // ((заказов вчера / заказов в день)-1) * 100
        const ordersPercent = ((yesterdayOrders / ordersPerDay) * 100).toFixed(
            2
        );
        // Общая выручка
        const totalGain = calculatePrice(allOrdes);
        //выручка в день
        const geinPerDay = totalGain / daysNumber;
        // Выручка вечера
        const yesterdayGain = calculatePrice(yesterdayOrders);
        // Процент выручки
        const gainPercent = ((yesterdayGain / geinPerDay) * 100).toFixed(2);
        // Сравние выручки
        const compareGain = (yesterdayGain - geinPerDay).toFixed(2);
        // Сравние количество заказов
        const compareNumber = (yestertdayOrdersNumber - ordersPerDay).toFixed(
            2
        );

        res.status(200).json({
            gain: {
                percent: Math.abs(+gainPercent),
                compare: Math.abs(+compareGain),
                yesterday: +yesterdayGain,
                isHigher: gainPercent > 0,
            },
            orders: {
                percent: Math.abs(+ordersPercent),
                compare: Math.abs(+compareNumber),
                yesterday: +yestertdayOrdersNumber,
                isHigher: ordersPercent > 0,
            },
        });
    } catch (error) {
        errorHadler(res, error);
    }
};

module.exports.analytics = function (req, res) {};

function getOrdrsMap(orders) {
    const daysOrders = {};

    orders.forEach((order) => {
        const date = moment(order.date).format('DD.MM.YYYY');

        if (date === moment().format('DD.MM.YYYY')) {
            return;
        }

        if (!daysOrders[date]) {
            daysOrders[date] = [];
        }

        daysOrders[date].push(order);
    });

    return daysOrders;
}

function calculatePrice(orders = []) {
    return orders.reduce((total, order) => {
        const orderPrice = order.reduce((totalOrder, item) => {
            return (totalOrder += item.cost * item.quantity);
        }, 0);
        return (total += orderPrice);
    }, 0);
}
