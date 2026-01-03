# =========================
# Dev target (local hot reload)
# =========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS dev
WORKDIR /src

# Optional: stable NuGet cache path
ENV NUGET_PACKAGES=/root/.nuget/packages

# Copy everything (dev wants full tree for dotnet watch)
COPY . .

# Expose API port (matches ASPNETCORE_URLS)
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

# Hot reload / watch
# --non-interactive: reduces terminal noise in containers
CMD ["dotnet", "watch", "run", "--project", "FinanceTracker.Api.csproj", "--urls", "http://0.0.0.0:8080", "--non-interactive"]

# =========================
# Debug target (stable process for attach)
# =========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS debug
WORKDIR /src

ENV NUGET_PACKAGES=/root/.nuget/packages

# In debug we also copy the source (will be overridden by volume mount in compose)
COPY . .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

# Stable process (no watch restarts)
CMD ["dotnet", "run", "--project", "FinanceTracker.Api.csproj", "--urls", "http://0.0.0.0:8080"]


# =========================
# Build target (CI/CD + prod publish)
# =========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

ENV NUGET_PACKAGES=/root/.nuget/packages

# Copy only csproj first for caching restore
COPY FinanceTracker.Api.csproj ./
RUN dotnet restore ./FinanceTracker.Api.csproj --nologo

# Copy remaining source
COPY . .

# Publish
RUN dotnet publish ./FinanceTracker.Api.csproj \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false \
    --nologo

# =========================
# Prod target (runtime only)
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS prod
WORKDIR /app

COPY --from=build /app/publish ./

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "FinanceTracker.Api.dll"]
