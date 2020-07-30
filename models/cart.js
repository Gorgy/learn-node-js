const { response } = require("express");

const path = require("path");
const fs = require("fs");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

class Cart {
  constructor() {}

  static async add(course) {
    const cart = await Cart.fetch();

    const idx = cart.courses.findIndex((c) => c.id === course.id);
    const canditate = cart.courses[idx];

    if (canditate) {
      // курс уже в корзине
      canditate.count++;
      cart.courses[idx] = canditate;
    } else {
      // добавить курс
      course.count = 1;
      course.price = Number(course.price);
      cart.courses.push(course);
    }

    cart.price += Number(course.price);

    return new Promise((resolve, reject) => {
      fs.writeFile(p, JSON.stringify(cart), (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  static async fetch() {
    return new Promise((resolve, reject) => {
      fs.readFile(p, "utf-8", (error, content) => {
        if (error) {
          reject(error);
        } else {
          resolve(JSON.parse(content));
        }
      });
    });
  }

  static async remove(id) {
    const cart = await Cart.fetch();

    const idx = cart.courses.findIndex((c) => c.id === id);
    const course = cart.courses[idx];

    if (course.count === 1) {
      cart.courses = cart.courses.filter((c) => c.id !== id);
    } else {
      cart.courses[idx].count--;
    }

    cart.price -= course.price;

    return new Promise((resolve, reject) => {
      fs.writeFile(p, JSON.stringify(cart), (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(cart);
        }
      });
    });
  }
}

module.exports = Cart;
