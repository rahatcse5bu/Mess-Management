import { useMemo, useState } from "react";
import AdjustmentsTab from "./components/AdjustmentsTab";
import CookingTab from "./components/CookingTab";
import DueReportTab from "./components/DueReportTab";
import LoginScreen from "./components/LoginScreen";
import MembersTab from "./components/MembersTab";
import MealsTab from "./components/MealsTab";
import PurchasesTab from "./components/PurchasesTab";
import TabNavigation from "./components/TabNavigation";
import {
  useAdjustmentsQuery,
  useCreateAdjustmentMutation,
  useCreateMealDayMutation,
  useCreateMemberMutation,
  useCreatePurchaseMutation,
  useCookingConfigQuery,
  useCookingHistoryQuery,
  useDeleteMemberMutation,
  useDueReportQuery,
  useLoginMutation,
  useMembersQuery,
  usePurchasesQuery,
  useUpdateCookingConfigMutation,
  useUpdatePurchaseMutation,
} from "./queries/mess";

const TABS = [
  "Members",
  "Cooking",
  "Meals",
  "Purchases",
  "Adjustments",
  "Due Report",
];
const EMPTY_LIST = [];

const getToday = () => new Date().toISOString().slice(0, 10);

const createLoginForm = () => ({
  email: "rahat.cse5.bu@gmail.com",
  password: "01783307672@Rahat",
});

const createMemberForm = () => ({
  name: "",
  email: "",
  phone: "",
});

const createMealForm = () => ({
  date: getToday(),
  elements: "",
  entries: {},
});

const createPurchaseForm = () => ({
  date: getToday(),
  description: "",
  amount: "",
  category: "general",
  paidByMemberId: "",
  note: "",
});

const createAdjustmentForm = () => ({
  date: getToday(),
  memberId: "",
  amount: "",
  type: "payment",
  note: "",
});

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const toMemberId = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object" && "_id" in value) {
    return value._id;
  }

  return String(value);
};

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [authError, setAuthError] = useState("");
  const [actionError, setActionError] = useState("");

  const [login, setLogin] = useState(createLoginForm);
  const [memberForm, setMemberForm] = useState(createMemberForm);
  const [mealForm, setMealForm] = useState(createMealForm);
  const [purchaseForm, setPurchaseForm] = useState(createPurchaseForm);
  const [adjustForm, setAdjustForm] = useState(createAdjustmentForm);
  const [cookDraft, setCookDraft] = useState(null);
  const [editingPurchaseId, setEditingPurchaseId] = useState("");

  const membersQuery = useMembersQuery(token);
  const cookingConfigQuery = useCookingConfigQuery(token);
  const cookingHistoryQuery = useCookingHistoryQuery(token);
  const purchasesQuery = usePurchasesQuery(token);
  const adjustmentsQuery = useAdjustmentsQuery(token);
  const dueReportQuery = useDueReportQuery(token);

  const loginMutation = useLoginMutation();
  const createMemberMutation = useCreateMemberMutation(token);
  const deleteMemberMutation = useDeleteMemberMutation(token);
  const updateCookingConfigMutation = useUpdateCookingConfigMutation(token);
  const createMealDayMutation = useCreateMealDayMutation(token);
  const createPurchaseMutation = useCreatePurchaseMutation(token);
  const createAdjustmentMutation = useCreateAdjustmentMutation(token);
  const updatePurchaseMutation = useUpdatePurchaseMutation(token);

  const members = membersQuery.data ?? EMPTY_LIST;
  const history = cookingHistoryQuery.data ?? EMPTY_LIST;
  const purchases = purchasesQuery.data ?? EMPTY_LIST;
  const adjustments = adjustmentsQuery.data ?? EMPTY_LIST;
  const report = dueReportQuery.data || null;
  const savedCookForm = useMemo(
    () => ({
      termDays: cookingConfigQuery.data?.config?.termDays ?? 2,
      memberOrder:
        cookingConfigQuery.data?.config?.memberOrder?.map(toMemberId) ||
        members.map((member) => member._id),
    }),
    [cookingConfigQuery.data, members],
  );
  const cookForm = cookDraft ?? savedCookForm;

  const updateLoginField = (field, value) => {
    setLogin((prev) => ({ ...prev, [field]: value }));
  };

  const updateMemberField = (field, value) => {
    setMemberForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateMealField = (field, value) => {
    setMealForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateMealEntry = (memberId, value) => {
    setMealForm((prev) => ({
      ...prev,
      entries: {
        ...prev.entries,
        [memberId]: value,
      },
    }));
  };

  const updatePurchaseField = (field, value) => {
    setPurchaseForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateAdjustmentField = (field, value) => {
    setAdjustForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateCookField = (field, value) => {
    setCookDraft((prev) => ({
      ...(prev ?? cookForm),
      [field]: value,
    }));
  };

  const runAction = async (mutation, variables, onSuccess) => {
    setActionError("");

    try {
      await mutation.mutateAsync(variables);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(error);
      setActionError(getErrorMessage(error, "Request failed."));
    }
  };

  const loginSubmit = async (event) => {
    event.preventDefault();
    setAuthError("");

    try {
      const response = await loginMutation.mutateAsync(login);
      localStorage.setItem("token", response.accessToken);
      setToken(response.accessToken);
    } catch (error) {
      setAuthError(getErrorMessage(error, "Login failed."));
    }
  };

  const addMember = async (event) => {
    event.preventDefault();

    await runAction(createMemberMutation, memberForm, () => {
      setMemberForm(createMemberForm());
      setCookDraft(null);
    });
  };

  const deleteMember = async (memberId) => {
    await runAction(deleteMemberMutation, memberId, () => setCookDraft(null));
  };

  const saveCookingConfig = async () => {
    await runAction(updateCookingConfigMutation, cookForm, () =>
      setCookDraft(null),
    );
  };

  const submitMeals = async (event) => {
    event.preventDefault();

    const entries = members.map((member) => ({
      memberId: member._id,
      mealCount: Number(mealForm.entries[member._id] || 0),
      note: "",
    }));

    await runAction(
      createMealDayMutation,
      {
        date: mealForm.date,
        elements: mealForm.elements
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
        entries,
      },
      () => setMealForm(createMealForm()),
    );
  };

  const submitPurchase = async (event) => {
    event.preventDefault();

    const payload = {
      ...purchaseForm,
      amount: Number(purchaseForm.amount),
      paidByMemberId: purchaseForm.paidByMemberId || undefined,
    };

    await runAction(
      editingPurchaseId
        ? updatePurchaseMutation
        : createPurchaseMutation,
      editingPurchaseId
        ? { id: editingPurchaseId, payload }
        : payload,
      () => {
        setPurchaseForm(createPurchaseForm());
        setEditingPurchaseId("");
      },
    );
  };

  const startEditPurchase = (purchase) => {
    setEditingPurchaseId(purchase._id);
    setPurchaseForm({
      date: purchase.date ? new Date(purchase.date).toISOString().slice(0, 10) : getToday(),
      description: purchase.description || "",
      amount:
        purchase.amount !== undefined && purchase.amount !== null
          ? String(purchase.amount)
          : "",
      category: purchase.category || "general",
      paidByMemberId: toMemberId(purchase.paidByMemberId),
      note: purchase.note || "",
    });
  };

  const cancelEditPurchase = () => {
    setEditingPurchaseId("");
    setPurchaseForm(createPurchaseForm());
  };

  const submitAdjustment = async (event) => {
    event.preventDefault();

    await runAction(
      createAdjustmentMutation,
      {
        ...adjustForm,
        amount: Number(adjustForm.amount),
      },
      () => setAdjustForm(createAdjustmentForm()),
    );
  };

  const moveOrder = (index, direction) => {
    setCookDraft((prev) => {
      const current = prev ?? cookForm;
      const next = [...current.memberOrder];
      const targetIndex = index + direction;

      if (targetIndex < 0 || targetIndex >= next.length) {
        return current;
      }

      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];

      return {
        ...current,
        memberOrder: next,
      };
    });
  };

  const dashboardError = [
    membersQuery.error,
    cookingConfigQuery.error,
    cookingHistoryQuery.error,
    purchasesQuery.error,
    adjustmentsQuery.error,
    dueReportQuery.error,
  ].find(Boolean);

  const isDashboardPending = [
    membersQuery.isPending,
    cookingConfigQuery.isPending,
    cookingHistoryQuery.isPending,
    purchasesQuery.isPending,
    adjustmentsQuery.isPending,
    dueReportQuery.isPending,
  ].some(Boolean);

  const isAnyActionPending = [
    createMemberMutation.isPending,
    deleteMemberMutation.isPending,
    updateCookingConfigMutation.isPending,
    createMealDayMutation.isPending,
    createPurchaseMutation.isPending,
    createAdjustmentMutation.isPending,
    updatePurchaseMutation.isPending,
  ].some(Boolean);

  const activePanel = {
    Members: (
      <MembersTab
        disabled={isAnyActionPending}
        memberForm={memberForm}
        members={members}
        onDeleteMember={deleteMember}
        onFieldChange={updateMemberField}
        onSubmit={addMember}
      />
    ),
    Cooking: (
      <CookingTab
        cookForm={cookForm}
        disabled={isAnyActionPending}
        history={history}
        members={members}
        onFieldChange={updateCookField}
        onMoveOrder={moveOrder}
        onSave={saveCookingConfig}
      />
    ),
    Meals: (
      <MealsTab
        disabled={isAnyActionPending}
        mealForm={mealForm}
        members={members}
        onEntryChange={updateMealEntry}
        onFieldChange={updateMealField}
        onSubmit={submitMeals}
      />
    ),
    Purchases: (
      <PurchasesTab
        disabled={isAnyActionPending}
        editingPurchaseId={editingPurchaseId}
        members={members}
        onCancelEdit={cancelEditPurchase}
        onEditPurchase={startEditPurchase}
        purchaseForm={purchaseForm}
        purchases={purchases}
        onFieldChange={updatePurchaseField}
        onSubmit={submitPurchase}
      />
    ),
    Adjustments: (
      <AdjustmentsTab
        adjustForm={adjustForm}
        adjustments={adjustments}
        disabled={isAnyActionPending}
        members={members}
        onFieldChange={updateAdjustmentField}
        onSubmit={submitAdjustment}
      />
    ),
    "Due Report": <DueReportTab report={report} />,
  }[activeTab];

  if (!token) {
    return (
      <LoginScreen
        error={authError}
        isSubmitting={loginMutation.isPending}
        login={login}
        onFieldChange={updateLoginField}
        onSubmit={loginSubmit}
      />
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <header className="mb-6 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-md">
        <h1 className="text-3xl font-black tracking-tight">Mess Management</h1>
        <p className="text-sm text-slate-600">
          Members, cooker rotation, meals, purchases, due, and adjustments.
        </p>
      </header>

      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={TABS}
      />

      {dashboardError && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {getErrorMessage(dashboardError, "Failed to load dashboard data.")}
        </p>
      )}

      {actionError && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </p>
      )}

      <section className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-md">
        {isDashboardPending ? (
          <p className="text-sm text-slate-600">Loading dashboard...</p>
        ) : (
          activePanel
        )}
      </section>
    </main>
  );
}

export default App;
