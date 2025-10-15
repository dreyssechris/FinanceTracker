# === Build stage ===
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# explicit NuGet Cache-Directory
ENV NUGET_PACKAGES=/root/.nuget/packages

# Only copy project files -> better caching 
COPY *.csproj .
RUN dotnet restore ./FinanceTracker.Api.csproj

# Copy the rest of the code 
COPY . .

# Release Publish
RUN dotnet publish ./FinanceTracker.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

# === Runtime stage ===
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
ENV ASPNETCORE_URLS=http://0.0.0.0:8080
EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "FinanceTracker.Api.dll"]