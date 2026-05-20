import React from "react";
import Link from "next/link";

const CategorySidebar = ({ categories, activeCategory }) => {
  return (
    <div className="category-sidebar">

      <h3 className="sidebar-title">Categories</h3>

      <ul>
        <li className={!activeCategory ? "active" : ""}>
          <Link href="/products">All</Link>
        </li>

        {categories.map((cat) => (
          <li
            key={cat.id}
            className={activeCategory == cat.id ? "active" : ""}
          >
            <Link href={`/products?category=${cat.id}`}>
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>

    </div>
  );
};

export default CategorySidebar;