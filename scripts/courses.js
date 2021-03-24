"use strict";
const gallery = document.querySelector(".gallery");

const renderCourses = function (courses) {
  courses.forEach((course) => {
    gallery.insertAdjacentHTML(
      "beforeend",
      `<div class="course">
      <img id="${course.id}" src="/content/img/galleryphoto${course.id}.jpeg" alt="${course.title}" />
      <p>${course.title}</p>
      <div class="course-description">${course.description}</div>
      </div>`
    );
  });
};

const listCourses = function () {
  fetch("http://localhost:3000/courses")
    .then((response) => response.json())
    .then((data) => renderCourses(data))
    .catch((err) => alert(err));
};

listCourses();