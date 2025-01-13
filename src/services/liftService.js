import Lift from "../models/liftModel.js";
import User from "../models/userModel.js";
// import Car from "../models/carModel.js";
import Application from "../models/applicationModel.js"

class LiftService {

  async create(lift) {
    const { cl, driver, startPoint, endPoint, schedule, price, providedSeats, occupiedSeats } = lift

    const driverDoc = await User.findOne({ _id: driver })
    if (!driverDoc && driver !== undefined) {
      throw new Error("DriverNotFound")
    }

    /* const carDoc = await Car.findOne({ cc: car })
    if (!carDoc && car !== undefined) {
      throw new Error("CarNotFound")
    } */
    await lift.save()
    await lift.populate("driver")
    return lift;
  }

  async list() {
    const lifts = await Lift.find().populate([
      {
        path: 'driver',
      },
      {
        path: 'applications',
        populate: {
          path: 'passenger',
          model: 'User',
        },
      },
    ]);

    if(lifts.length === 0) {
        throw new Error("NoLiftFound")
    }
    return lifts
  }

  async listByCode(code) {
    const lift = await Lift.findOne({cl: code}).populate([
      {
        path: 'driver',
      },
      {
        path: 'applications',
        populate: {
          path: 'passenger',
          model: 'User',
        },
      },
    ]);

    if(!lift) {
        throw new Error("NoLiftFound")
    }
    return lift
  }
  async update(code, data) {
    const { cl, /* driver, car, */ startPoint, endPoint, schedule, price, providedSeats, occupiedSeats } = data

    const lift = await Lift.findOne({ cl: cl })
    if (!lift) {
      throw new Error("LiftNotFound")
    }

    /* const driverDoc = await User.findOne({ username: driver })
    if (!driverDoc && driver !== undefined) {
      throw new Error("DriverNotFound")
    }

    const carDoc = await Car.findOne({ cc: car })
    if (!carDoc && car !== undefined) {
      throw new Error("CarNotFound")
    } */

    Object.assign(lift, data)
    await lift.save()

    return lift
  }
  async delete(cl) {

    const lift = Lift.findOne({cl: cl})
    if(!lift) {
        throw new Error("LiftNotFound")
    }

    /* const application = Application.findOne({lift: lift._id})
    if(application) {
        throw new Error("ApplicationAssociated")
    } */
    await lift.deleteOne()
  }
}

export default new LiftService();
