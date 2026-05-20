import React from "react";
import Link from "next/link";

const CategoryBox = ({ category }) => {
  return (
    <Link href={`/products?category=${category.id}`}>
      <div className="category-box">
        <h3>{category.name}</h3>
      </div>
    </Link>
  );
};

export default CategoryBox;