import { faker } from "@faker-js/faker";

import mock from "./adapter";

import { verify, sign } from "../utils/jwt";

const JWT_SECRET = "super-secret-key";
const JWT_EXPIRES_IN = "3 days";

const users = [
  {
    id: "a8553063-7bd5-45ed-adbe-db6f069a3802",
    displayName: "Lucy Lavender",
    email: "demo@bootlab.io",
    password: "unsafepassword",
    avatar: "/static/img/avatars/avatar-1.jpg",
  },
];

function fakeRequest(time) {
  return new Promise((res) => setTimeout(res, time));
}

mock.onPost("/api/auth/sign-in").reply(async (config) => {
  try {
    await fakeRequest(1000);

    const { email, password } = JSON.parse(config.data);
    const user = users.find((_user) => _user.email === email);

    if (!user) {
      return [
        400,
        { message: "There is no user corresponding to the email address." },
      ];
    }

    if (user.password !== password) {
      return [400, { message: "Incorrect password" }];
    }

    const accessToken = sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return [200, { accessToken, user }];
  } catch (error) {
    console.error(error);
    return [500, { message: "Internal server error" }];
  }
});

mock.onPost("/api/auth/sign-up").reply(async (config) => {
  try {
    await fakeRequest(1000);

    const { email, password, firstName, lastName } = JSON.parse(config.data);
    let user = users.find((_user) => _user.email === email);

    if (user) {
      return [
        400,
        {
          message:
            "There already exists an account with the given email address.",
        },
      ];
    }

    user = {
      id: faker.datatype.uuid(),
      displayName: `${firstName} ${lastName}`,
      email,
      password,
      avatar: null,
    };

    const accessToken = sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return [200, { accessToken, user }];
  } catch (error) {
    console.error(error);
    return [500, { message: "Internal server error" }];
  }
});

mock.onGet("/api/auth/my-account").reply((config) => {
  try {
    const { Authorization } = config.headers;

    if (!Authorization) {
      return [401, { message: "Authorization token missing" }];
    }

    const accessToken = Authorization.split(" ")[1];
    const data = verify(accessToken, JWT_SECRET);
    const userId = typeof data === "object" ? data?.userId : "";
    const user = users.find((_user) => _user.id === userId);

    if (!user) {
      return [401, { message: "Invalid authorization token" }];
    }

    return [200, { user }];
  } catch (error) {
    console.error(error);
    return [500, { message: "Internal server error" }];
  }
});
