# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["MealPlanner.Api/MealPlanner.Api.csproj", "MealPlanner.Api/"]
RUN dotnet restore "MealPlanner.Api/MealPlanner.Api.csproj"

COPY . .
WORKDIR "/src/MealPlanner.Api"
RUN dotnet publish "MealPlanner.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
RUN apt-get update && apt-get install -y --no-install-recommends libkrb5-3 && rm -rf /var/lib/apt/lists/*
WORKDIR /app

ENV ASPNETCORE_URLS=http://0.0.0.0:10000
EXPOSE 10000

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "MealPlanner.Api.dll"]