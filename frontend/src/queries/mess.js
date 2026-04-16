import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";

export const messQueryKeys = {
  members: ["members"],
  cookingConfig: ["cooking", "config"],
  cookingHistory: ["cooking", "history"],
  purchases: ["purchases"],
  adjustments: ["adjustments"],
  dueReport: ["reports", "due-summary"],
};

const dashboardKeys = [
  messQueryKeys.members,
  messQueryKeys.cookingConfig,
  messQueryKeys.cookingHistory,
  messQueryKeys.purchases,
  messQueryKeys.adjustments,
  messQueryKeys.dueReport,
];

const clientFor = (token) => api(token);

const getData = async (request) => {
  const response = await request;
  return response.data;
};

const invalidateKeys = async (queryClient, keys) => {
  await Promise.all(
    keys.map((queryKey) => queryClient.invalidateQueries({ queryKey })),
  );
};

const useInvalidatingMutation = ({
  token,
  mutationFn,
  invalidate = dashboardKeys,
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables) => mutationFn(clientFor(token), variables),
    onSuccess: async () => {
      await invalidateKeys(queryClient, invalidate);
    },
  });
};

export const useLoginMutation = () =>
  useMutation({
    mutationFn: (credentials) =>
      getData(api().post("/auth/login", credentials)),
  });

export const useMembersQuery = (token, enabled = true) =>
  useQuery({
    queryKey: messQueryKeys.members,
    queryFn: () => getData(clientFor(token).get("/members")),
    enabled: Boolean(token) && enabled,
  });

export const useCookingConfigQuery = (token, enabled = true) =>
  useQuery({
    queryKey: messQueryKeys.cookingConfig,
    queryFn: () => getData(clientFor(token).get("/cooking/config")),
    enabled: Boolean(token) && enabled,
  });

export const useCookingHistoryQuery = (token, enabled = true) =>
  useQuery({
    queryKey: messQueryKeys.cookingHistory,
    queryFn: () => getData(clientFor(token).get("/cooking/history")),
    enabled: Boolean(token) && enabled,
  });

export const usePurchasesQuery = (token, enabled = true) =>
  useQuery({
    queryKey: messQueryKeys.purchases,
    queryFn: () => getData(clientFor(token).get("/purchases")),
    enabled: Boolean(token) && enabled,
  });

export const useAdjustmentsQuery = (token, enabled = true) =>
  useQuery({
    queryKey: messQueryKeys.adjustments,
    queryFn: () => getData(clientFor(token).get("/adjustments")),
    enabled: Boolean(token) && enabled,
  });

export const useDueReportQuery = (token, enabled = true) =>
  useQuery({
    queryKey: messQueryKeys.dueReport,
    queryFn: () => getData(clientFor(token).get("/reports/due-summary")),
    enabled: Boolean(token) && enabled,
  });

export const useCreateMemberMutation = (token) =>
  useInvalidatingMutation({
    token,
    invalidate: [
      messQueryKeys.members,
      messQueryKeys.cookingConfig,
      messQueryKeys.cookingHistory,
      messQueryKeys.dueReport,
    ],
    mutationFn: (client, payload) => getData(client.post("/members", payload)),
  });

export const useDeleteMemberMutation = (token) =>
  useInvalidatingMutation({
    token,
    invalidate: [
      messQueryKeys.members,
      messQueryKeys.cookingConfig,
      messQueryKeys.cookingHistory,
      messQueryKeys.dueReport,
    ],
    mutationFn: (client, memberId) =>
      getData(client.delete(`/members/${memberId}`)),
  });

export const useUpdateCookingConfigMutation = (token) =>
  useInvalidatingMutation({
    token,
    invalidate: [messQueryKeys.cookingConfig, messQueryKeys.cookingHistory],
    mutationFn: (client, payload) =>
      getData(client.patch("/cooking/config", payload)),
  });

export const useCreateMealDayMutation = (token) =>
  useInvalidatingMutation({
    token,
    invalidate: [messQueryKeys.dueReport],
    mutationFn: (client, payload) =>
      getData(client.post("/meals/day", payload)),
  });

export const useCreatePurchaseMutation = (token) =>
  useInvalidatingMutation({
    token,
    invalidate: [messQueryKeys.purchases, messQueryKeys.dueReport],
    mutationFn: (client, payload) =>
      getData(client.post("/purchases", payload)),
  });

export const useUpdatePurchaseMutation = (token) =>
  useInvalidatingMutation({
    token,
    invalidate: [messQueryKeys.purchases, messQueryKeys.dueReport],
    mutationFn: (client, { id, payload }) =>
      getData(client.patch(`/purchases/${id}`, payload)),
  });

export const useCreateAdjustmentMutation = (token) =>
  useInvalidatingMutation({
    token,
    invalidate: [messQueryKeys.adjustments, messQueryKeys.dueReport],
    mutationFn: (client, payload) =>
      getData(client.post("/adjustments", payload)),
  });
