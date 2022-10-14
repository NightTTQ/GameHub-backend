import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    // 通过反射获取需要的roles
    const roles = this.reflector.get<string[]>("roles", context.getHandler());
    console.log(roles);

    // 没有任何roles需求
    if (!roles || roles.length === 0) return true;

    // TODO:验证请求是否拥有相应的roles
  }
}
