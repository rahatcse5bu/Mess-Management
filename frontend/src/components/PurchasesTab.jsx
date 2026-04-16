import { useMemo, useRef, useState } from "react";
import { formatAmount, formatDate } from "../utils/format";

const CUSTOM_CATEGORY_VALUE = "__custom__";
const PAGE_SIZE = 5;

const CATEGORY_OPTIONS = [
  { value: "general", label: "General" },
  { value: "rice", label: "Rice" },
  { value: "vegetables", label: "Vegetables" },
  { value: "fish-meat", label: "Fish and Meat" },
  { value: "eggs", label: "Eggs" },
  { value: "dal", label: "Dal" },
  { value: "oil-spices", label: "Oil and Spices" },
  { value: "gas", label: "Gas" },
  { value: "cleaning", label: "Cleaning" },
  { value: "utilities", label: "Utilities" },
];

const getPaidById = (purchase) => {
  const paidBy = purchase.paidByMemberId;

  if (!paidBy) {
    return "";
  }

  if (typeof paidBy === "string") {
    return paidBy;
  }

  if (typeof paidBy === "object" && "_id" in paidBy) {
    return paidBy._id;
  }

  return String(paidBy);
};

export default function PurchasesTab({
  disabled,
  editingPurchaseId,
  members,
  onCancelEdit,
  onEditPurchase,
  purchaseForm,
  purchases,
  onFieldChange,
  onSubmit,
}) {
  const formRef = useRef(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    paidByMemberId: "",
    from: "",
    to: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const selectedCategory = CATEGORY_OPTIONS.some(
    (category) => category.value === purchaseForm.category,
  )
    ? purchaseForm.category
    : purchaseForm.category
      ? CUSTOM_CATEGORY_VALUE
      : "general";

  const availableCategories = useMemo(() => {
    const categoryMap = new Map(
      CATEGORY_OPTIONS.map((category) => [category.value, category.label]),
    );

    for (const purchase of purchases) {
      if (purchase.category && !categoryMap.has(purchase.category)) {
        categoryMap.set(purchase.category, purchase.category);
      }
    }

    return Array.from(categoryMap, ([value, label]) => ({ value, label }));
  }, [purchases]);

  const filteredPurchases = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return purchases.filter((purchase) => {
      const purchaseDate = formatDate(purchase.date);
      const paidByName = purchase.paidByMemberId?.name || "";
      const matchesSearch =
        !search ||
        [
          purchase.description,
          purchase.category,
          purchase.note,
          paidByName,
          purchase.addedBy?.name,
          purchase.updatedBy?.name,
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(search));

      const matchesCategory =
        !filters.category || purchase.category === filters.category;
      const matchesPaidBy =
        !filters.paidByMemberId ||
        getPaidById(purchase) === filters.paidByMemberId;
      const matchesFrom = !filters.from || purchaseDate >= filters.from;
      const matchesTo = !filters.to || purchaseDate <= filters.to;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPaidBy &&
        matchesFrom &&
        matchesTo
      );
    });
  }, [filters, purchases]);

  const totalAmount = useMemo(
    () =>
      filteredPurchases.reduce(
        (sum, purchase) => sum + Number(purchase.amount || 0),
        0,
      ),
    [filteredPurchases],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPurchases.length / PAGE_SIZE),
  );
  const activePage = Math.min(currentPage, totalPages);

  const paginatedPurchases = useMemo(() => {
    const startIndex = (activePage - 1) * PAGE_SIZE;
    return filteredPurchases.slice(startIndex, startIndex + PAGE_SIZE);
  }, [activePage, filteredPurchases]);

  const updateFilter = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      paidByMemberId: "",
      from: "",
      to: "",
    });
    setCurrentPage(1);
  };

  const handleEditPurchase = (purchase) => {
    onEditPurchase(purchase);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-4">
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="grid gap-3 md:grid-cols-2"
      >
        <input
          type="date"
          disabled={disabled}
          className="rounded border p-2"
          value={purchaseForm.date}
          onChange={(event) => onFieldChange("date", event.target.value)}
        />
        <input
          className="rounded border p-2"
          placeholder="Description"
          disabled={disabled}
          value={purchaseForm.description}
          onChange={(event) =>
            onFieldChange("description", event.target.value)
          }
          required
        />
        <input
          type="number"
          min="0"
          disabled={disabled}
          className="rounded border p-2"
          placeholder="Amount"
          value={purchaseForm.amount}
          onChange={(event) => onFieldChange("amount", event.target.value)}
          required
        />
        <div className="space-y-2">
          <select
            className="w-full rounded border p-2"
            disabled={disabled}
            value={selectedCategory}
            onChange={(event) => {
              const nextValue = event.target.value;
              onFieldChange(
                "category",
                nextValue === CUSTOM_CATEGORY_VALUE ? "" : nextValue,
              );
            }}
          >
            {CATEGORY_OPTIONS.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
            <option value={CUSTOM_CATEGORY_VALUE}>Others</option>
          </select>
          {selectedCategory === CUSTOM_CATEGORY_VALUE && (
            <input
              className="w-full rounded border p-2"
              placeholder="Enter custom category"
              disabled={disabled}
              value={purchaseForm.category}
              onChange={(event) =>
                onFieldChange("category", event.target.value)
              }
            />
          )}
        </div>
        <select
          className="rounded border p-2"
          disabled={disabled}
          value={purchaseForm.paidByMemberId}
          onChange={(event) =>
            onFieldChange("paidByMemberId", event.target.value)
          }
        >
          <option value="">Paid by unknown / outside</option>
          {members.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name}
            </option>
          ))}
        </select>
        <input
          className="rounded border p-2"
          placeholder="Note"
          disabled={disabled}
          value={purchaseForm.note}
          onChange={(event) => onFieldChange("note", event.target.value)}
        />
        <button
          disabled={disabled}
          className="rounded bg-[var(--accent)] p-2 text-white disabled:cursor-not-allowed disabled:opacity-70 md:col-span-2"
        >
          {editingPurchaseId ? "Update Purchase" : "Add Purchase"}
        </button>
        {editingPurchaseId && (
          <button
            type="button"
            disabled={disabled}
            onClick={onCancelEdit}
            className="rounded border border-slate-300 p-2 text-slate-700 disabled:cursor-not-allowed disabled:opacity-70 md:col-span-2"
          >
            Cancel Edit
          </button>
        )}
      </form>

      <div className="grid gap-3 rounded border p-3 md:grid-cols-5">
        <input
          className="rounded border p-2 md:col-span-2"
          placeholder="Search purchases"
          value={filters.search}
          onChange={(event) => updateFilter("search", event.target.value)}
        />
        <select
          className="rounded border p-2"
          value={filters.category}
          onChange={(event) => updateFilter("category", event.target.value)}
        >
          <option value="">All categories</option>
          {availableCategories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        <select
          className="rounded border p-2"
          value={filters.paidByMemberId}
          onChange={(event) =>
            updateFilter("paidByMemberId", event.target.value)
          }
        >
          <option value="">All payers</option>
          {members.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={clearFilters}
          className="rounded border border-slate-300 p-2 text-slate-700"
        >
          Clear Filters
        </button>
        <input
          type="date"
          className="rounded border p-2"
          value={filters.from}
          onChange={(event) => updateFilter("from", event.target.value)}
        />
        <input
          type="date"
          className="rounded border p-2"
          value={filters.to}
          onChange={(event) => updateFilter("to", event.target.value)}
        />
        <div className="rounded border border-[var(--line)] bg-[var(--accent-soft)] p-2 text-sm font-medium text-[var(--ink)] md:col-span-3">
          Showing {filteredPurchases.length} of {purchases.length} purchases |
          Total Tk {formatAmount(totalAmount)}
        </div>
      </div>

      {paginatedPurchases.map((purchase) => (
        <div key={purchase._id} className="rounded border p-3 text-sm">
          <p className="font-medium">
            {formatDate(purchase.date)} - {purchase.description} - Tk{" "}
            {formatAmount(purchase.amount)}
          </p>
          <p className="mt-1 text-slate-600">
            Category: {purchase.category || "general"} | Paid by:{" "}
            {purchase.paidByMemberId?.name || "Unknown"}
          </p>
          <p className="mt-1 text-slate-600">
            Added by: {purchase.addedBy?.name || "Unknown"}
            {purchase.updatedBy && ` | Updated by: ${purchase.updatedBy.name}`}
          </p>
          {purchase.note && (
            <p className="mt-1 text-slate-500">Note: {purchase.note}</p>
          )}
          <div className="mt-3">
            <button
              type="button"
              disabled={disabled}
              onClick={() => handleEditPurchase(purchase)}
              className="rounded border border-slate-300 px-3 py-1 text-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Edit
            </button>
          </div>
        </div>
      ))}

      {filteredPurchases.length === 0 && (
        <p className="rounded border p-3 text-sm text-slate-600">
          No purchases match the current filters.
        </p>
      )}

      {filteredPurchases.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded border p-3 text-sm">
          <p>
            Page {activePage} of {totalPages}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={activePage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              className="rounded border border-slate-300 px-3 py-1 text-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={activePage === totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              className="rounded border border-slate-300 px-3 py-1 text-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
