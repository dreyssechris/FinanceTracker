# === Build stage ===
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# explicit NuGet Cache-Directory
ENV NUGET_PACKAGES=/root/.nuget/packages

# Only copy project files -> better caching 
COPY FinanceTracker.Api.csproj ./FinanceTracker.Api.csproj
RUN dotnet restore ./FinanceTracker.Api.csproj --disable-parallel --nologo

# Copy the rest of the code 
COPY . .

# Release Publish
RUN dotnet build ./FinanceTracker.Api.csproj -c Release --no-restore -v minimal

# Publish
RUN dotnet publish ./FinanceTracker.Api.csproj -c Release -o /app/publish /p:UseAppHost=false --nologo

# === Runtime stage ===
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish ./
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "FinanceTracker.Api.dll"]