import React from "react";
import Link from "next/link";

const CategorySidebar = ({
  categories = [],
  activeCategory,
}) => {

  return (

    <div className="category-sidebar">

      <h3 className="sidebar-title">
        Categories
      </h3>

      <ul>

        {/* ALL PRODUCTS */}
        <li
          className={
            !activeCategory
              ? "active"
              : ""
          }
        >

          <Link href="/products">
            All
          </Link>

        </li>

        {/* CATEGORY LIST */}
        {categories

          ?.filter(
            (cat) =>
              cat &&
              cat.id
          )

          ?.map((cat) => (

            <li
              key={cat.id}
              className={
                activeCategory == cat.id
                  ? "active"
                  : ""
              }
            >

              <Link
                href={`/products?category=${cat.id}`}
              >

                {cat.name || "Category"}

              </Link>

            </li>

          ))}

      </ul>

    </div>
  );
};

export default CategorySidebar;